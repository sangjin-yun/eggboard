package com.sdplex.egg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class EggApplication {

	public static void main(String[] args) {
		SpringApplication.run(EggApplication.class, args);
	}
	
}
