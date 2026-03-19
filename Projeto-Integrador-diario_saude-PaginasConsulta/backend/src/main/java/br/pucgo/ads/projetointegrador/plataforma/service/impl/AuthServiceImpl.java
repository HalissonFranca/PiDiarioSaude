package br.pucgo.ads.projetointegrador.plataforma.service.impl;

import br.pucgo.ads.projetointegrador.plataforma.dto.JwtAuthResponse;
import br.pucgo.ads.projetointegrador.plataforma.dto.LoginDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.SignupDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Permission;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.exception.ApiException;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.plataforma.security.JwtTokenProvider;
import br.pucgo.ads.projetointegrador.plataforma.service.AuthService;
import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioInfoRepository;

    // ✅ Apenas UM construtor com todos os parâmetros
    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           UsuarioRepository usuarioInfoRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.usuarioInfoRepository = usuarioInfoRepository;
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmailWithPermissions(loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Set<Permission> allPermissions = new HashSet<>();

        if (user.getRole() != null && user.getRole().getPermissions() != null) {
            allPermissions.addAll(user.getRole().getPermissions());
        }

        if (user.getPermissions() != null) {
            allPermissions.addAll(user.getPermissions());
        }

        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());

        if (user.getRole() != null) {
            response.setRoleName(user.getRole().getName());
            response.setRoleCode(user.getRole().getCode());
        }

        Set<Map<String, Object>> permissionsJson = allPermissions.stream()
                .map(permission -> Map.of(
                        "id", (Object) permission.getId(),
                        "name", (Object) permission.getName(),
                        "module_id", (Object) (permission.getModule() != null ? permission.getModule().getId() : "")))
                .collect(Collectors.toSet());

        response.setPermissions(permissionsJson);

        return response; // ✅ return no lugar certo
    }

    @Override
    public String signup(SignupDto signupDto) {
        if (userRepository.existsByUsername(signupDto.getUsername())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username already exists!");
        }

        if (userRepository.existsByEmail(signupDto.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already exists!");
        }

        Role role;
        if (signupDto.getRoleId() != null) {
            role = roleRepository.findById(signupDto.getRoleId())
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST,
                            "Role não encontrada com ID: " + signupDto.getRoleId()));
        } else {
            role = roleRepository.findByName("ROLE_IDOSO")
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST,
                            "Role padrão ROLE_IDOSO não encontrada"));
        }

        User user = new User();
        user.setName(signupDto.getName());
        user.setUsername(signupDto.getUsername());
        user.setEmail(signupDto.getEmail());
        user.setPassword(passwordEncoder.encode(signupDto.getPassword()));
        user.setRole(role);
        user.setBirthDate(signupDto.getBirthDate());
        user.setPhone(signupDto.getPhone());

        if (role.getName().equals("ROLE_MEDICO")) {
            if (signupDto.getCrm() == null || signupDto.getCrm().isBlank()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "CRM é obrigatório para médicos.");
            }
            user.setCrm(signupDto.getCrm());
        }

        if (role.getName().equals("ROLE_CUIDADOR")) {
            user.setCertificacao(signupDto.getCertificacao());
            user.setExperiencia(signupDto.getExperiencia());
        }

        User savedUser = userRepository.save(user);

        // ✅ Cria registro no módulo diário ANTES do return
        if (role.getName().equals("ROLE_IDOSO")) {
            UsuarioEntity usuarioInfo = new UsuarioEntity();
            usuarioInfo.setUserId(savedUser.getId()); // ← usa o ID retornado pelo banco
            usuarioInfo.setNome(savedUser.getName());
            usuarioInfo.setIdade(0);
            usuarioInfo.setPeso(0);
            usuarioInfo.setAltura(0);
            usuarioInfoRepository.save(usuarioInfo);
        }

        return "User registered successfully!";
    }
}