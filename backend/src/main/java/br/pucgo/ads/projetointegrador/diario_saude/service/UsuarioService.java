package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.diario_saude.dto.UsuarioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream().map(UsuarioDTO::new).toList();
    }

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
        // busca o registro real pelo user_id em vez de usar o id que veio do frontend
        UsuarioEntity entity = usuarioRepository.findByUser_Id(usuario.getUserId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado para userId: " + usuario.getUserId()));

        // atualiza só os campos clínicos, sem mexer no id ou no user
        entity.setNome(usuario.getNome());
        entity.setIdade(usuario.getIdade());
        entity.setPeso(usuario.getPeso());
        entity.setAltura(usuario.getAltura());

        return new UsuarioDTO(usuarioRepository.save(entity));
    }

    public void excluir(Long id) {
        usuarioRepository.delete(usuarioRepository.findById(id).get());
    }

    public UsuarioDTO buscarPorId(Long id) {
        return new UsuarioDTO(usuarioRepository.findById(id).get());
    }

    public List<UsuarioDTO> listarIdosos() {
        return usuarioRepository.findAllIdosos().stream().map(UsuarioDTO::new).toList();
    }

    // busca ou cria automaticamente o paciente na usuario_info_clinica
    public UsuarioEntity buscarOuCriarPaciente(Long userId) {
        Optional<UsuarioEntity> existente = usuarioRepository.findByUser_Id(userId);
        if (existente.isPresent()) {
            return existente.get();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User não encontrado: id=" + userId));

        UsuarioEntity entity = new UsuarioEntity();
        entity.setNome(user.getName());
        entity.setIdade(0); // preenchido depois pelo médico no dashboard
        entity.setPeso(0); // preenchido depois pelo médico no dashboard
        entity.setAltura(0); // preenchido depois pelo médico no dashboard
        entity.setUser(user);

        return usuarioRepository.save(entity);
    }
}