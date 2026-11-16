package com.example.bairroVivo.service;

import com.example.bairroVivo.entity.*;
import com.example.bairroVivo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository repository;
    private final LocalizacaoRepository localizacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final BairroRepository bairroRepository;

    public OcorrenciaService(
            OcorrenciaRepository repository,
            LocalizacaoRepository localizacaoRepository,
            UsuarioRepository usuarioRepository,
            CategoriaRepository categoriaRepository,
            BairroRepository bairroRepository) {

        this.repository = repository;
        this.localizacaoRepository = localizacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.bairroRepository = bairroRepository;
    }

    public List<Ocorrencia> listarOcorrencias() {
        return repository.findAll();
    }

    public Ocorrencia buscarOcorrencia(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));
    }

    @Transactional
    public Ocorrencia inserirOcorrencia(Ocorrencia x) {

        validar(x);

        // 1. Busca o usuário existente
        Usuario usuario = usuarioRepository.findById(
                x.getUsuario().getIdUsuario()
        ).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 2. Busca a categoria existente
        Categoria categoria = categoriaRepository.findById(
                x.getCategoria().getIdCategoria()
        ).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        // 3. Busca o bairro existente
        Bairro bairro = bairroRepository.findById(
                x.getLocalizacao().getBairro().getIdBairro()
        ).orElseThrow(() -> new RuntimeException("Bairro não encontrado"));

        // 4. Prepara a localização com o bairro encontrado
        Localizacao localizacao = x.getLocalizacao();
        localizacao.setBairro(bairro);

        // 5. Salva a localização primeiro
        Localizacao localizacaoSalva =
                localizacaoRepository.save(localizacao);

        // 6. Associa os registros existentes à ocorrência
        x.setUsuario(usuario);
        x.setCategoria(categoria);
        x.setLocalizacao(localizacaoSalva);

        if (x.getDataCriacao() == null) {
            x.setDataCriacao(LocalDate.now());
        }

        // 7. Salva a ocorrência
        return repository.save(x);
    }

    @Transactional
    public Ocorrencia atualizarOcorrencia(Long id, Ocorrencia x) {

        Ocorrencia existente = buscarOcorrencia(id);

        validar(x);

        Usuario usuario = usuarioRepository.findById(
                x.getUsuario().getIdUsuario()
        ).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Categoria categoria = categoriaRepository.findById(
                x.getCategoria().getIdCategoria()
        ).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Bairro bairro = bairroRepository.findById(
                x.getLocalizacao().getBairro().getIdBairro()
        ).orElseThrow(() -> new RuntimeException("Bairro não encontrado"));

        Localizacao localizacao = x.getLocalizacao();
        localizacao.setBairro(bairro);

        Localizacao localizacaoSalva =
                localizacaoRepository.save(localizacao);

        existente.setUsuario(usuario);
        existente.setLocalizacao(localizacaoSalva);
        existente.setCategoria(categoria);
        existente.setTitulo(x.getTitulo());
        existente.setDescricao(x.getDescricao());
        existente.setStatus(x.getStatus());
        existente.setDataResolucao(x.getDataResolucao());

        return repository.save(existente);
    }

    private void validar(Ocorrencia x) {

        if (x.getUsuario() == null ||
                x.getUsuario().getIdUsuario() == null) {
            throw new IllegalArgumentException("Usuário é obrigatório");
        }

        if (x.getCategoria() == null ||
                x.getCategoria().getIdCategoria() == null) {
            throw new IllegalArgumentException("Categoria é obrigatória");
        }

        if (x.getLocalizacao() == null ||
                x.getLocalizacao().getBairro() == null ||
                x.getLocalizacao().getBairro().getIdBairro() == null) {
            throw new IllegalArgumentException("Localização e bairro são obrigatórios");
        }

        if (x.getStatus() == null ||
                !Set.of("Resolvido", "Pendente", "Em analise", "Cancelado")
                        .contains(x.getStatus())) {
            throw new IllegalArgumentException("Status da ocorrência inválido");
        }

        if ("Resolvido".equals(x.getStatus()) &&
                x.getDataResolucao() == null) {
            x.setDataResolucao(LocalDate.now());
        }
    }
    public Ocorrencia atualizarStatus(Long id, String novoStatus) {
        Ocorrencia ocorrencia = buscarOcorrencia(id);

        if (!java.util.Set.of("Resolvido", "Pendente", "Em analise", "Cancelado")
                .contains(novoStatus)) {
            throw new IllegalArgumentException("Status inválido");
        }

        ocorrencia.setStatus(novoStatus);

        if ("Resolvido".equals(novoStatus)) {
            ocorrencia.setDataResolucao(java.time.LocalDate.now());
        } else {
            ocorrencia.setDataResolucao(null);
        }

        return repository.save(ocorrencia);
    }
}