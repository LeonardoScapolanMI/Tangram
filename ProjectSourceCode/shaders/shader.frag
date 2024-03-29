#version 450

layout(set = 1, binding = 1) uniform sampler2D texSampler;

layout(set = 0, binding = 0) uniform globalUniformBufferObject {
	mat4 view;
	mat4 proj;
	vec3 ambientLight;
	vec3 eyePos;
	vec4 paramDecay;
	vec3 spotlight_pos;
} gubo;

layout(set = 1, binding = 0) uniform UniformBufferObject {
	mat4 model;
	mat4 normalMatrix;
	vec4 color;
	float selected;
} ubo;


layout(location = 0) in vec3 fragPos;
layout(location = 1) in vec3 fragNorm;
layout(location = 2) in vec2 fragTexCoord;

layout(location = 0) out vec4 outColor;

void main() {
	vec3  diffColor = texture(texSampler, fragTexCoord).rgb * ubo.color.rgb;

	vec3 lightColor_Spot = vec3(0.9f, 0.9f, 0.9f);
	vec3 lightPos_Spot = gubo.spotlight_pos;
	vec3 direction_Spot = - normalize(vec3(0.0f, -1.0f, 0.0f));

	const vec3  specColor = vec3(0.3f, 0.3f, 0.3f);
	const float specPower = 150.0f;


	vec3 lD = normalize(lightPos_Spot - fragPos); //light direction

	float decay = pow(gubo.paramDecay.x / length(lightPos_Spot - fragPos), gubo.paramDecay.y);
	float spotlightConeFactor = clamp((dot(direction_Spot, lD) - gubo.paramDecay.w)/(gubo.paramDecay.z - gubo.paramDecay.w), 0, 1);
	vec3 lightColor = (lightColor_Spot * decay * spotlightConeFactor) + gubo.ambientLight;

	vec3 N = normalize(fragNorm);
	vec3 R = -reflect(lD, N);
	// vec3 V = normalize(fragPos);
	vec3 EyeDir = normalize(gubo.eyePos.xyz - fragPos);
	
	// Lambert diffuse
	vec3 diffuse  = diffColor * max(dot(N,lD), 0.0f);
	// Phong specular
	vec3 specular = specColor * pow(max(dot(EyeDir, R), 0.0f), specPower);
	// Hemispheric ambient
	vec3 ambient  = (vec3(0.1f,0.1f, 0.1f) * (1.0f + N.y) + vec3(0.3f,0.3f,0.3f) * (1.0f - N.y)) * diffColor;

	outColor = vec4(clamp((diffuse + specular + ambient)*lightColor, vec3(0.0f), vec3(1.0f)), ubo.color.a);
}