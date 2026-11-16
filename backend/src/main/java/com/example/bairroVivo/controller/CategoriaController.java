package com.example.bairroVivo.controller;

import com.example.bairroVivo.entity.Categoria;
import com.example.bairroVivo.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categoria")
public class CategoriaController {
    private final CategoriaService service;
    public CategoriaController(CategoriaService service) { this.service = service; }
    @GetMapping public List<Categoria> listarCategorias() { return service.listarCategorias(); }
    @GetMapping("/{id}") public ResponseEntity<Categoria> buscar(@PathVariable Long id) { return ResponseEntity.ok(service.buscarCategoria(id)); }
    @PostMapping public ResponseEntity<Categoria> inserir(@RequestBody Categoria x) { return ResponseEntity.ok(service.inserirCategoria(x)); }
    @PutMapping("/{id}") public ResponseEntity<Categoria> atualizar(@PathVariable Long id, @RequestBody Categoria x) { return ResponseEntity.ok(service.atualizarCategoria(id, x)); }
}
