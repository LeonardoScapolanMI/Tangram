#version 450

layout(set = 0, binding = 0) uniform globalUniformBufferObject {
	mat4 view;
	mat4 proj;
} gubo;

layout(set = 1, binding = 0) uniform WireframeUniformBufferObject {
	mat4 model;
	vec4 color;
} ubo;


layout(location = 0) in vec3 fragPos;
layout(location = 1) in vec3 fragNorm;
layout(location = 2) in vec2 fragTexCoord;

layout(location = 0) out vec4 outColor;

void main() {
    outColor = ubo.color;
}