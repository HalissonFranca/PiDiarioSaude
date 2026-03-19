package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.dto.JwtAuthResponse;
import br.pucgo.ads.projetointegrador.plataforma.dto.LoginDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.SignupDto;

<<<<<<< HEAD
import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;

public interface AuthService {
    JwtAuthResponse login(LoginDto loginDto);
    String signup(SignupDto signupDto);
}


=======
public interface AuthService {
    JwtAuthResponse login(LoginDto loginDto);
    String signup(SignupDto signupDto);
}
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
