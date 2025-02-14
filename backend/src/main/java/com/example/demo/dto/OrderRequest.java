package com.example.demo.dto;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import java.util.List;

public class OrderRequest {
    private Order order;
    private List<OrderItemDto> orderItems;
    private boolean sameAsDelivery;

    public OrderRequest(Order order, List<OrderItemDto> orderItems, boolean sameAsDelivery) {
        this.order = order;
        this.orderItems = orderItems;
        this.sameAsDelivery = sameAsDelivery;
    }

    public OrderRequest() {}

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public List<OrderItemDto> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDto> orderItems) {
        this.orderItems = orderItems;
    }

    public boolean isSameAsDelivery() { return sameAsDelivery; }
    public void setSameAsDelivery(boolean sameAsDelivery) { this.sameAsDelivery = sameAsDelivery; }
}