package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode; // Dodajemy EqualsAndHashCode

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category")
@Data
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String categoryName;

    @ManyToMany(mappedBy = "productCategories")
    @JsonIgnore
    private Set<Product> products = new HashSet<>();

}