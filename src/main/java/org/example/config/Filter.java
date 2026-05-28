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
            "/api/register",
            "/api/verify-otp",
            "/api/payment/payos/webhook",
            "/api/forgot-password",
            "/api/reset-password"








    );

    public boolean checkIsPublicAPI(String uri){

        AntPathMatcher patchMatcher = new AntPathMatcher();

        return AUTH_PERMISION.stream().anyMatch(pattern -> patchMatcher.match(pattern, uri));
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        boolean isPublicAPI = checkIsPublicAPI(request.getRequestURI());
        if(isPublicAPI){
            filterChain.doFilter(request, response);
        }else{
            String token = getToken(request);
            if(token == null){

                resolver.resolveException(request, response, null, new AuthException("Empty token"));
                return;
            }

            Account account;
            try{
                account = tokenService.getAccountByToken(token);
            }catch(ExpiredJwtException e){

                resolver.resolveException(request, response, null, new AuthException("Expired token"));
                return;
            }catch(MalformedJwtException malformedJwtException){

                resolver.resolveException(request, response, null, new AuthException("Invalid token"));
                return;
            }

            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(account, token, account.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);

        }


    }
    public String getToken(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7);
    }
}
