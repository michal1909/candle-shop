package com.example.demo.controller;

import com.example.demo.dao.ProductRepository;
import com.example.demo.dto.OrderItemDto;
import com.example.demo.dto.OrderRequest;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.service.OrderService;
import com.example.demo.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest, Principal principal) {
        String email = principal.getName();
        User user = userService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Order order = new Order();

        order.setAddress(orderRequest.getOrder().getAddress());

        if (orderRequest.isSameAsDelivery()) {
            order.setInvoiceAddress(order.getAddress());
        } else {
            order.setInvoiceAddress(orderRequest.getOrder().getInvoiceAddress());
        }

        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemDto> orderItemDtos = orderRequest.getOrderItems();

        if (orderItemDtos != null) {
            for (OrderItemDto orderItemDto : orderItemDtos) {
                if (orderItemDto.getProductId() != null) {  //Check for null productId
                    try {
                        Product product = productRepository.findById(orderItemDto.getProductId())
                                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

                        OrderItem orderItem = new OrderItem();
                        orderItem.setProduct(product); // This is the crucial line that was missing
                        orderItem.setQuantity(orderItemDto.getQuantity());
                        orderItem.setPrice(product.getPrice()); //Use the price from the fetched product.
                        orderItem.setOrder(order);
                        orderItems.add(orderItem);
                    } catch (EntityNotFoundException ex) {
                        System.err.println("Error: " + ex.getMessage());
                        // Consider returning an error response to the client if a product is not found
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Example: Return 400
                    }
                } else {
                    System.err.println("productId is null for an orderItem. Skipping.");
                }
            }
        } else {
            System.err.println("orderItemDtos is null. No order items to process.");
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(order.calculateTotalPrice()); // Recalculate total price

        Order createdOrder = orderService.createOrder(order, orderItems, user);
        return ResponseEntity.ok(createdOrder);
    }

}