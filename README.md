# ⚽ TERZO TEMPO - Gestione Partite Calcio Amatoriale

**TERZO TEMPO** è una web app moderna progettata per semplificare l'organizzazione e il monitoraggio delle statistiche per i gruppi di amici che giocano a calcio. Dalla registrazione dei risultati al tracciamento automatico dei marcatori e delle medie punti, tutto in un unico posto.

---

## 🚀 Funzionalità Principali

* **🏆 Classifiche Live:** Ranking generale basato su punti (3-1-0) e media punti, con classifica marcatori dedicata.
* **📊 Analisi Avanzata:** Statistiche dettagliate per singolo giocatore e trend delle partite.
* **🏟️ Storico Match:** Registro completo di tutte le partite giocate, con punteggi, squadre e dettagli marcatori.
* **🔐 Area Admin Protetta:** Sistema di autenticazione (Supabase Auth) per proteggere l'inserimento e la modifica dei dati.
* **📱 Mobile First:** Interfaccia ottimizzata per l'uso immediato su smartphone direttamente a bordo campo.
* **⚡ Performance:** Gestione ottimizzata degli stati di caricamento e pagine di errore personalizzate.

## 🛠️ Tech Stack

* **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Routing:** [React Router v6](https://reactrouter.com/)
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
* **Hosting:** [Vercel](https://vercel.com/)
* **Stato & Auth:** Hooks personalizzati per la gestione della sessione in tempo reale.

---

## ⚙️ Configurazione e Installazione Locale

1. **Clona il repository:**
```bash
git clone https://github.com/LucaRuggeri5/terzo-tempo-app.git
cd terzo-tempo-app

```


2. **Installa le dipendenze:**
```bash
npm install

```


3. **Configura le variabili d'ambiente:**
Crea un file `.env.local` nella root del progetto e aggiungi le tue credenziali Supabase:
```env
VITE_SUPABASE_URL=il_tuo_url_supabase
VITE_SUPABASE_ANON_KEY=la_tua_chiave_anon_supabase

```


4. **Avvia l'ambiente di sviluppo:**
```bash
npm run dev

```



---

## 🔒 Sicurezza e RLS

Il progetto utilizza il **Row Level Security (RLS)** di Supabase per garantire che:

* Tutti gli utenti possano visualizzare le classifiche e lo storico (`SELECT`).
* Solo l'amministratore autenticato possa inserire, modificare o eliminare dati (`INSERT`, `UPDATE`, `DELETE`).

---

## 📦 Deploy

L'app è configurata per il deploy continuo su **Vercel**. Ogni push sul ramo `main` avvia automaticamente una nuova build. Per gestire correttamente il routing (refresh delle pagine), è presente una configurazione dedicata in `vercel.json`.

---

## 🤝 Contatti

**Sviluppatore:** Luca Ruggeri

**Project Link:** [https://github.com/LucaRuggeri5/terzo-tempo-app](https://www.google.com/search?q=https://github.com/LucaRuggeri5/terzo-tempo-app)

---

*Realizzato con ❤️ per la passione del calcio e della birra post-partita.*

---