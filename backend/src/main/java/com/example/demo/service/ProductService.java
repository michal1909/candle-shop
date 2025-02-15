package com.example.demo.service;

import com.example.demo.dao.ProductRepository;
import com.example.demo.dao.ProductCategoryRepository;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductCategory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, ProductCategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(Long id, Product newProduct) {
        return productRepository.findById(id).map(existingProduct -> {
            existingProduct.setName(newProduct.getName());
            existingProduct.setDescription(newProduct.getDescription());
            existingProduct.setPrice(newProduct.getPrice());
            existingProduct.setStock(newProduct.getStock());
            existingProduct.setImageUrl(newProduct.getImageUrl());

            return productRepository.save(existingProduct);
        });
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}