package middleware

import(
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"context"
	"os"
)

type contextKey string  

const UserContextKey contextKey = "user"

func Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie,err:= r.Cookie("token")
		if err!= nil {
			if err == http.ErrNoCookie {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
		claims := jwt.MapClaims{}
		token,err:= jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("ACCESS_TOKEN_SECRET")), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusBadRequest)
			return
		}
		ctx:=context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserFromContext(r *http.Request) (jwt.MapClaims, bool) {
	claims, ok := r.Context().Value(UserContextKey).(jwt.MapClaims)
	return claims, ok
}

func RestrictTo(roles ...string) func(http.Handler) http.Handler {
    roleSet := make(map[string]struct{})
    for _, role := range roles {
        roleSet[role] = struct{}{}
    }

    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            claims, ok := r.Context().Value(UserContextKey).(jwt.MapClaims)
            if !ok {
                http.Error(w, "Forbidden - No Claims Found", http.StatusForbidden)
                return
            }
            userRole, ok := claims["role"].(string)
            if !ok {
                http.Error(w, "Forbidden - No Role Found", http.StatusForbidden)
                return
            }

            if _, ok := roleSet[userRole]; !ok {
                http.Error(w, "Forbidden - Role Not Allowed", http.StatusForbidden)
                return
            }

            next.ServeHTTP(w, r)
        })
    }
}
