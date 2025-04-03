package com.example.grandehorse.global.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class RedisConfig {
	@Value("${spring.data.redis.websocket.host}")
	private String websocketRedisHost;

	@Value("${spring.data.redis.websocket.port}")
	private int websocketRedisPort;

	@Value("${spring.data.redis.websocket.password}")
	private String websocketRedisPassword;

	@Value("${spring.data.redis.default.host}")
	private String defaultRedisHost;

	@Value("${spring.data.redis.default.port}")
	private int defaultRedisPort;

	@Value("${spring.data.redis.default.password}")
	private String defaultRedisPassword;

	@Bean
	@Qualifier("websocketRedisConnectionFactory")
	public RedisConnectionFactory websocketRedisConnectionFactory() {
		RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(websocketRedisHost, websocketRedisPort);
		config.setPassword(websocketRedisPassword);
		return new LettuceConnectionFactory(config);
	}

	@Bean
	@Qualifier("redisConnectionFactory")
	public RedisConnectionFactory redisConnectionFactory() {
		RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(defaultRedisHost, defaultRedisPort);
		config.setPassword(defaultRedisPassword);
		return new LettuceConnectionFactory(config);
	}

	@Bean
	@Qualifier("websocketRedisTemplate")
	public RedisTemplate<String, Object> websocketRedisTemplate(
		@Qualifier("websocketRedisConnectionFactory") RedisConnectionFactory redisConnectionFactory
	) {
		RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(redisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new StringRedisSerializer());

		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.enable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

		GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(serializer);
		template.setHashKeySerializer(new StringRedisSerializer());
		template.setHashValueSerializer(serializer);

		template.afterPropertiesSet();

		return template;
	}

	@Bean
	@Qualifier("redisTemplate")
	public RedisTemplate<String, Object> redisTemplate(
		@Qualifier("redisConnectionFactory") RedisConnectionFactory redisConnectionFactory
	) {
		RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(redisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new StringRedisSerializer());
		return template;
	}
}
