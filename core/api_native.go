package core

import (
	"log"
	"net/http"
	"net/url"
)

func ApiNative(fn func(string, http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		p, _ := url.ParseQuery(r.URL.RawQuery)
		token := p.Get("token")
		log.Println(token)
		log.Println(p)

		var userID []string
		err := database.Table("users").Where("api_token = ?", token).Pluck("id", &userID).Error

		log.Println(userID)

		if err == nil && len(userID) > 0 {
			fn(userID[0], w, r)
		} else {
			w.WriteHeader(403)
		}
	}
}
