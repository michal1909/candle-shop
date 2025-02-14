package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode; // Dodajemy EqualsAndHashCode

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "product")
@Data
@EqualsAndHashCode(exclude = "productCategories")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(name = "stock")
    private int stock;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}) // Zmieniamy cascade
    @JoinTable(name = "product_category",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<ProductCategory> productCategories = new HashSet<>();


    public void addCategory(ProductCategory category) {
        this.productCategories.add(category);
        category.getProducts().add(this);
    }

    public void removeCategory(ProductCategory category) {
        this.productCategories.remove(category);
        category.getProducts().remove(this);
    }
}