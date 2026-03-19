package org.example.config;

import org.example.entity.Account;
import org.example.exception.AuthException;
import org.example.service.TokenService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class Filter extends OncePerRequestFilter {
    @Autowired
    TokenService tokenService;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    HandlerExceptionResolver resolver;
    private final List<String> AUTH_PERMISION = List.of(
            "/",
            "/swagger",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/api/login",
            "/api/register"








    );

    public boolean checkIsPublicAPI(String uri){
        //uri: /api/register
        //nếu gặp những cái api ở list trên => cho phép truy cập => true


        AntPathMatcher patchMatcher = new AntPathMatcher();

        //check token ==> false

        return AUTH_PERMISION.stream().anyMatch(pattern -> patchMatcher.match(pattern, uri));
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //check xem cái api mà người dùng yêu cầu có phải là 1 cái public api kh?

        boolean isPublicAPI = checkIsPublicAPI(request.getRequestURI());
        if(isPublicAPI){
            filterChain.doFilter(request, response);
        }else{
            String token = getToken(request);
            if(token == null){
                //kh được phép truy cap
                resolver.resolveException(request, response, null, new AuthException("Empty token"));
                return;
            }

            // có token
            //check xem toke có hợp lệ kh
            //lấy thông tin account từ token
            Account account;
            try{
                account = tokenService.getAccountByToken(token);
            }catch(ExpiredJwtException e){
                //token hết hạn
                resolver.resolveException(request, response, null, new AuthException("Expired token"));
                return;
            }catch(MalformedJwtException malformedJwtException){
                //token sai
                resolver.resolveException(request, response, null, new AuthException("Invalid token"));
                return;
            }

            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(account, token, account.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);

            //token chuẩn
            //cho phép truy cập


        }


    }
    public String getToken(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7);
    }
}
