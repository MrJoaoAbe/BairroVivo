package com.example.bairroVivo.service;

import com.example.bairroVivo.entity.Foto;
import com.example.bairroVivo.repository.FotoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FotoService {
    private final FotoRepository repository;
    public FotoService(FotoRepository repository) { this.repository = repository; }
    public List<Foto> listarFotos() { return repository.findAll(); }
    public Foto buscarFoto(Long id) { return repository.findById(id).orElseThrow(() -> new RuntimeException("Foto não encontrado(a)")); }
    public Foto inserirFoto(Foto x)
    { if (x.getDataUpload() == null) x.setDataUpload(java.time.LocalDate.now()); return repository.save(x); }
    public Foto atualizarFoto(Long id, Foto x)
    { Foto e = buscarFoto(id); e.setUrlImagem(x.getUrlImagem()); e.setOcorrencia(x.getOcorrencia()); return repository.save(e); }
}
