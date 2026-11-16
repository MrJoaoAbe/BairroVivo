package com.example.bairroVivo.controller;

import com.example.bairroVivo.entity.Bairro;
import com.example.bairroVivo.service.BairroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bairro")
public class BairroController {
    private final BairroService service;
    public BairroController(BairroService service) { this.service = service; }
    @GetMapping public List<Bairro> listarBairros() { return service.listarBairros(); }
    @GetMapping("/{id}") public ResponseEntity<Bairro> buscar(@PathVariable Long id) { return ResponseEntity.ok(service.buscarBairro(id)); }
    @PostMapping public ResponseEntity<Bairro> inserir(@RequestBody Bairro x) { return ResponseEntity.ok(service.inserirBairro(x)); }
    @PutMapping("/{id}") public ResponseEntity<Bairro> atualizar(@PathVariable Long id, @RequestBody Bairro x) { return ResponseEntity.ok(service.atualizarBairro(id, x)); }
}
