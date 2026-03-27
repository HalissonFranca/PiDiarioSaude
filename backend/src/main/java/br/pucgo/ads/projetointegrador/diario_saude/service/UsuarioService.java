package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.diario_saude.dto.UsuarioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
// ✅ imports novos
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UserRepository userRepository; // ✅ novo

    public List<UsuarioDTO> listarTodos() {
        List<UsuarioEntity> usuarios = usuarioRepository.findAll();
        return usuarios.stream().map(UsuarioDTO::new).toList();
    }

    // ✅ inserir agora vincula o User se userId vier no body
    public void inserir(UsuarioDTO usuario) {
        UsuarioEntity usuarioEntity = new UsuarioEntity(usuario);

        if (usuario.getUserId() != null) {
            User user = userRepository.findById(usuario.getUserId())
                    .orElseThrow(() -> new RuntimeException("User não encontrado: id=" + usuario.getUserId()));
            usuarioEntity.setUser(user);
        }

        usuarioRepository.save(usuarioEntity);
    }

    public UsuarioDTO alterar(UsuarioDTO usuario) {
        UsuarioEntity usuarioEntity = new UsuarioEntity(usuario);
        return new UsuarioDTO(usuarioRepository.save(usuarioEntity));
    }

    public void excluir(Long id) {
        UsuarioEntity usuario = usuarioRepository.findById(id).get();
        usuarioRepository.delete(usuario);
    }

    public UsuarioDTO buscarPorId(Long id) {
        return new UsuarioDTO(usuarioRepository.findById(id).get());
    }

    public List<UsuarioDTO> listarIdosos() {
        return usuarioRepository.findAllIdosos()
                .stream()
                .map(UsuarioDTO::new)
                .toList();
    }
}