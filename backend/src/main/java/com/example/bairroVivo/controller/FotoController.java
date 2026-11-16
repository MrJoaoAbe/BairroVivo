package com.example.bairroVivo.controller;

import com.example.bairroVivo.entity.Foto;
import com.example.bairroVivo.service.FotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/foto")
public class FotoController {
    private final FotoService service;
    public FotoController(FotoService service) { this.service = service; }
    @GetMapping public List<Foto> listarFotos() { return service.listarFotos(); }
    @GetMapping("/{id}") public ResponseEntity<Foto> buscar(@PathVariable Long id) { return ResponseEntity.ok(service.buscarFoto(id)); }
    @PostMapping public ResponseEntity<Foto> inserir(@RequestBody Foto x) { return ResponseEntity.ok(service.inserirFoto(x)); }
    @PutMapping("/{id}") public ResponseEntity<Foto> atualizar(@PathVariable Long id, @RequestBody Foto x) { return ResponseEntity.ok(service.atualizarFoto(id, x)); }
}
