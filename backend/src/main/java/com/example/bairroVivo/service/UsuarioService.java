package com.example.bairroVivo.service;

import com.example.bairroVivo.entity.Usuario;
import com.example.bairroVivo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    public UsuarioService(UsuarioRepository repository) { this.repository = repository; }
    public List<Usuario> listarUsuarios() { return repository.findAll(); }
    public Usuario buscarUsuario(Long id) { return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado(a)")); }
    public Usuario inserirUsuario(Usuario x) {
        if (!"Ativa".equals(x.getStatusConta()) && !"Inativa".equals(x.getStatusConta())) throw new IllegalArgumentException("Status da conta inválido");
        if (x.getDataCadastro() == null) x.setDataCadastro(java.time.LocalDate.now());
        return repository.save(x);
    }
    public Usuario atualizarUsuario(Long id, Usuario x) {
        Usuario e = buscarUsuario(id); e.setNome(x.getNome()); e.setEmail(x.getEmail()); e.setSenha(x.getSenha()); e.setStatusConta(x.getStatusConta());
        if (!"Ativa".equals(e.getStatusConta()) && !"Inativa".equals(e.getStatusConta())) throw new IllegalArgumentException("Status da conta inválido");
        return repository.save(e);
    }
}
