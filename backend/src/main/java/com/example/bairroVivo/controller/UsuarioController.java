package com.example.bairroVivo.controller;

import com.example.bairroVivo.entity.Usuario;
import com.example.bairroVivo.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    private final UsuarioService service;
    public UsuarioController(UsuarioService service) { this.service = service; }
    @GetMapping public List<Usuario> listarUsuarios() { return service.listarUsuarios(); }
    @GetMapping("/{id}") public ResponseEntity<Usuario> buscar(@PathVariable Long id) { return ResponseEntity.ok(service.buscarUsuario(id)); }
    @PostMapping public ResponseEntity<Usuario> inserir(@RequestBody Usuario x) { return ResponseEntity.ok(service.inserirUsuario(x)); }
    @PutMapping("/{id}") public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario x) { return ResponseEntity.ok(service.atualizarUsuario(id, x)); }
}
