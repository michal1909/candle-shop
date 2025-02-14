package com.example.demo.service;

import com.example.demo.dao.ProductRepository;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.dao.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public Order createOrder(Order order, List<OrderItem> orderItems, User user) {
        order.setUser(user);
        order.setOrderItems(orderItems);

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItem orderItem : orderItems) {
            System.out.println("OrderItem: Product ID: " + orderItem.getProduct().getId() + ", Price: " + orderItem.getPrice() + ", Quantity: " + orderItem.getQuantity());
            orderItem.setOrder(order);
            totalPrice = totalPrice.add(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
        }

        order.setTotalPrice(totalPrice);
        order.setActive(true);

        Order savedOrder = orderRepository.save(order);
        System.out.println("Saved Order ID: " + savedOrder.getId() + ", Total Price: " + savedOrder.getTotalPrice());
        System.out.println("Order Items count: " + savedOrder.getOrderItems().size());

        return savedOrder;
    }
}