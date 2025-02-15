package com.example.demo.dao;

import com.example.demo.entity.Order;
import com.example.demo.entity.ProductCategory;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "orders", path = "orders")
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}