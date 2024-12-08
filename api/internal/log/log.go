package log

import (
	"log"
	"os"
)

var Error = log.New(os.Stderr, "\u001b[31m[ERROR] \u001b[0m", log.Ldate|log.Ltime|log.Lshortfile)
var Info = log.New(os.Stderr, "\u001b[34m[INFO] \u001B[0m", log.Ldate|log.Ltime|log.Lshortfile)
