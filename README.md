# Progetto_Programmazione Avanzata 2025/26

## Obiettivo

L'obiettivo del progetto è di realizzare un sistema che constenta di gestire il gioco della battaglia navale. In particolare, il sistema deve prevedere la possibilità di far interagire 2 utenti autenticati mediante JWT. l'utente può decidere se giocare con un secondo giocatore o contro un bot. La partita giocata dagli utenti può essere classica oppure avere una versione alternativa, dove i giocatori possono omettere l'esito di un colpo subito (massimo 5 volte se previsto). Ogni creazione di una partita e ogni mossa eseguita hanno un costo di token che viene scalato da una quantità appartenente ai giocatori. Il sistema deve prevedere anche la possibilità di ricaricare i token a un giocatore da parte di un admin del gioco. 

## Progettazione
### Strumenti adottati nel progetto
- Docker
- Node.js
- Sequelize
- Express
- JWT
- bcryptjs
- PostgreSQL
- Jest
- TypeScript

### Requisiti di progetto

Analizzando le specifiche del progetto, sono stati individuati i seguenti requisiti funzionali:
- RF1. Il sistema deve autenticare gli utenti tramite jwt
- RF2. L'utente deve porte giocare una partita contro un secondo utente
- RF3. L'utente deve porte giocare una partita contro un bot
- RF4. L'utente deve porte giocare una partita alternativa con un giocatore umano
- RF5. L'utente deve porte creare una nuova partita (solo se non sta giocando ancora)
- RF6. Il sistema deve addebitare un numero di token per creazione della partita
- RF7. Il sistema deve addebitare un numero di token per ogni mossa in partita
- RF8. Il sistema deve validare le richieste
- RF9. Rotta per effettuare la mossa
- RF10. Rotta per ottenere lo stato di una partita
- RF11. Rotta per restituire lo storico di una partita
- RF12. Il sistema deve restituire 401 unauthirized se i token sono insufficenti per creare una partita
- RF13. Rotta admin per ricaricare i token ad un utente
- RF14. Il sistema deve memorizzare nel db il numero di token
- RF12. devono esserci almeno 2 test Jest
- RF13. gestire gli errori con eccezioni con middleware

### Diagramma Casi d'uso

In questa sezione viene riportato il diagramma dei Casi d'uso che coprono tutte le funzionalità del progetto riportate nella sezione dei requisiti.

### Diagramma UML

Il seguente diagramma UML mostra la correlazione tra le classi che definiscno le principali entità del sistema.
![Diagramma UML delle classi](immagini/uml.png)

### Diagrammi di sequenza
In questa sezione sono riportati i diagrammi di sequenza dei meccanismi più complessi del progetto.
Il seguente diagramma evidenzia i meccanismi che si attivano nell'esecuzione di un colpo eseguito da un giocatore.

## Implementazione

### Pattern adottati
Per una corretta implementazione sono stati utilizzati diversi pattern di programmazione ampiamente consolidati ed in grado di semplificare lo sviluppo di applicazioni complesse.

### DAO
DAO è un pattern architetturale che ha lo scopo di disaccoppiare la logica dell'accesso ai dati dalla loro memorizzazione. Nel progetto il DAO è stato sviluppato implementando le classi DAO per ogni entità del backend (User, Match, Move). Ogni classe Dao è stata collegata ai Controller.
### MVC
MVC è un pattern architetturale che si basa sul principio di separazione delle responsabilità, strutturando le classi in Model, View, Controller. Nel progetto sono state suddivise le classi del Model da quelle del Controller; la View non è stata implementata poiché l'obiettivo del progetto è il backend. I Controller sono classi che hanno la responsabilità di manipolare gli oggetti del Model e coordinare le richieste che possono arrivare, ad esempio, dalle rotte. Oltre a ciò, i Controller lavorano con i dati del Model interfacciandosi con le classi del Dao. I Model sono classi che si limitano a definire la struttura degli oggetti che rappresentano e dei loro metodi, delegando il resto delle funzioni ai Controller.

### Singleton
Singleton è un pattern creazionale che consente di assicurare l'esistenza di un solo oggetto ed unico oggetto per la classe che adotta questo pattern. Nel progetto è stato usato Singleton per garantire che il sistema lavori con un solo oggetto Database.

### Factory Method
Factory Method è un pattern creazionale che fornisce un'interfaccia per la creazione di oggetti di una superclasse. Tale pattern si è rivelato utile per la gestione dei messaggi di errore.

### Chain of responsability
CoR è un pattern comportamentale che consente di passare delle richieste lungo una catena di Handler. Quando un sistema riceve una richiesta, può dover eseguire numerosi controlli, anche complessi, prima di elaborarla. Il pattern Chain of Responsibility (CoR) disaccoppia il mittente della richiesta dai suoi gestori: la richiesta attraversa una catena di oggetti, ognuno dei quali può gestirla oppure passarla al successivo. Nel progetto tale comportamento è stato adottato nella gestione dell'autenticazione dell'utente e nella gestione dei messaggi di errore.

## Installazione
Per eseguire una corretta installazione è necessario avere i seguenti strumenti installati: Docker, Nodejs (24), Postman, Git e npm.

### 1. Clonare il repository

```bash
git clone <URL-del-repository>
cd Progetto_Prog_A
```

### 2. Creare il file `.env`

Copiare il file di esempio:

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Aprire `.env` e sostituire il valore di `JWT_SECRET` con una stringa lunga e casuale.

### 3. Avviare l'applicazione

```bash
docker compose up --build
```

## Test

Per eseguire i test, scrivere nel terminale (fuori dal Docker): 
```bash
npm test
```