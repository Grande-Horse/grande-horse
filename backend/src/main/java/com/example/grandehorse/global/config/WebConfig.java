package com.example.grandehorse.global.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.grandehorse.global.resolver.UserArgumentResolver;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
	private final UserArgumentResolver userArgumentResolver;

	@Value("${FRONT_URL}")
	private String frontUri;

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(userArgumentResolver);  // ArgumentResolver 등록
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins(
				"http://localhost:4173", frontUri, "https://j12a606.p.ssafy.io/"
			)
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.exposedHeaders(
				"Authorization", "Set-Cookie", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"
			)
			.allowCredentials(true)
			.maxAge(3600);
	}
}
