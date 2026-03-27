package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.pucgo.ads.projetointegrador.diario_saude.dto.UsuarioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.service.UsuarioService;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/diario_saude/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UsuarioDTO> ListarTodos() {
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
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id) {
        usuarioService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/idosos")
    public List<UsuarioDTO> listarIdosos() {
        return usuarioService.listarIdosos();
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
