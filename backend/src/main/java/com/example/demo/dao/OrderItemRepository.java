package com.example.demo.dao;

import com.example.demo.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "orderItems", path = "orderItems")
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}