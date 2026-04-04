package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.UsuarioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.service.UsuarioService;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

@RestController
@RequestMapping(value = "/api/diario_saude/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public void inserir(@RequestBody UsuarioDTO usuario) {
        usuarioService.inserir(usuario);
    }

    @PutMapping
    public UsuarioDTO alterar(@RequestBody UsuarioDTO usuario) {
        return usuarioService.alterar(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        usuarioService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/idosos")
    public List<UsuarioDTO> listarIdosos() {
        return usuarioService.listarIdosos();
    }

    @GetMapping("/por-user/{userId}")
    public ResponseEntity<UsuarioDTO> buscarPorUserId(@PathVariable Long userId) {
        UsuarioEntity entity = usuarioService.buscarOuCriarPaciente(userId);
        UsuarioDTO dto = new UsuarioDTO(entity);

        // ✅ BeanUtils não copia User → userId, então populamos manualmente
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/pacientes")
    public ResponseEntity<List<Map<String, Object>>> listarPacientes() {
        List<Map<String, Object>> pacientes = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "ROLE_IDOSO".equals(u.getRole().getName()))
                .map(u -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id_usuario", u.getId());
                    map.put("nome", u.getName());
                    map.put("email", u.getEmail());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(pacientes);
    }
}