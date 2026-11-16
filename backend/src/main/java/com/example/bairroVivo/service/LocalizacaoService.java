package com.example.bairroVivo.service;

import com.example.bairroVivo.entity.Localizacao;
import com.example.bairroVivo.repository.LocalizacaoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LocalizacaoService {
    private final LocalizacaoRepository repository;
    public LocalizacaoService(LocalizacaoRepository repository) { this.repository = repository; }
    public List<Localizacao> listarLocalizacoes() { return repository.findAll(); }
    public Localizacao buscarLocalizacao(Long id) { return repository.findById(id).orElseThrow(() -> new RuntimeException("Localizacao não encontrado(a)")); }
    public Localizacao inserirLocalizacao(Localizacao x) { return repository.save(x); }
    public Localizacao atualizarLocalizacao(Long id, Localizacao x)
    { Localizacao e = buscarLocalizacao(id);
        e.setLatitude(x.getLatitude());
        e.setLongitude(x.getLongitude());
        e.setNumero(x.getNumero());
        e.setRua(x.getRua());
        e.setPontoReferencia(x.getPontoReferencia());
        e.setComplemento(x.getComplemento());
        e.setBairro(x.getBairro());
        return repository.save(e); }
}
