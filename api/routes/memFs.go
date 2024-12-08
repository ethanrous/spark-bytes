package routes

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type InMemoryFS struct {
	routes   map[string]*memFileReal
	index    *memFileReal
	routesMu sync.RWMutex
	baseDir  string

	proxyAddress string
}

func (fs *InMemoryFS) loadIndex() string {
	indexPath := filepath.Join(fs.baseDir, "index.html")
	fs.index = readFile(indexPath, fs)
	if !fs.index.exists {
		panic("Could not find index file at " + indexPath)
	}

	return indexPath
}

// Open Implements FileSystem interface
func (fs *InMemoryFS) Open(name string) (http.File, error) {
	if name == "/index" {
		return fs.Index("/index"), nil
	}
	var f *memFileReal
	var ok bool
	name, err := filepath.Abs(filepath.Join(fs.baseDir, name))
	if err != nil {
		return nil, err
	}

	fs.routesMu.RLock()
	if f, ok = fs.routes[name]; ok && f.exists {
		fs.routesMu.RUnlock()
		return newWrapFile(f), nil
	} else if !ok {
		fs.routesMu.RUnlock()
		f = readFile(name, fs)
		if f != nil {
			fs.routesMu.Lock()
			fs.routes[f.Name] = f
			fs.routesMu.Unlock()
		}
	} else {
		fs.routesMu.RUnlock()
	}

	// var err error
	if f == nil || !f.exists {
		return fs.Index(name), nil
	}
	return newWrapFile(f), nil
}

func newWrapFile(real *memFileReal) *MemFileWrap {
	return &MemFileWrap{
		at:       0,
		realFile: real,
	}
}

func (fs *InMemoryFS) Exists(path string) bool {
	if path == "/" || path == "//" {
		return false
	} else if path == "/index" {
		return true
	}

	path = filepath.Join(fs.baseDir, path)
	_, err := fs.Open(path)
	return err == nil
}

func (fs *InMemoryFS) ReadFile(path string) ([]byte, error) {
	if path == "/" || path == "//" {
		return nil, fmt.Errorf("Invalid path")
	} else if path == "/index" {
		return fs.index.data, nil
	}

	f, err := fs.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return io.ReadAll(f)
}

type MemFileWrap struct {
	realFile *memFileReal
	at       int64
}

type memFileReal struct {
	fs     *InMemoryFS
	Name   string
	data   []byte
	exists bool
}

func (mf *memFileReal) Copy() *memFileReal {
	return &memFileReal{
		Name:   mf.Name,
		data:   mf.data,
		exists: mf.exists,
		fs:     mf.fs,
	}
}

func (fs *InMemoryFS) Index(loc string) *MemFileWrap {
	index := newWrapFile(fs.index.Copy())
	return index
}

func readFile(filePath string, fs *InMemoryFS) *memFileReal {
	fdata, err := os.ReadFile(filePath)

	return &memFileReal{
		Name:   filePath,
		data:   fdata,
		exists: err == nil,
		fs:     fs,
	}
}

// Close Implements the comm.File interface
func (f *MemFileWrap) Close() error {
	return nil
}
func (f *MemFileWrap) Stat() (os.FileInfo, error) {
	return &InMemoryFileInfo{f.realFile}, nil
}
func (f *memFileReal) Stat() (os.FileInfo, error) {
	return &InMemoryFileInfo{f}, nil
}
func (f *MemFileWrap) Readdir(count int) ([]os.FileInfo, error) {
	res := make([]os.FileInfo, len(f.realFile.fs.routes))
	i := 0
	for _, file := range f.realFile.fs.routes {
		res[i], _ = file.Stat()
		i++
	}
	return res, nil
}
func (f *MemFileWrap) Read(b []byte) (int, error) {
	if f.at >= int64(len(f.realFile.data)) {
		return 0, io.EOF
	}
	if f.at+int64(len(b)) > int64(len(f.realFile.data)) {
		n := copy(b, f.realFile.data[f.at:])
		f.at += int64(n)
		return n, nil
	}
	n := copy(b, f.realFile.data[f.at:f.at+int64(len(b))])
	f.at += int64(len(b))
	return n, nil
	// buf := bytes.NewBuffer(b)
	// return buf.Write(f.data)

	// i := 0
	// for f.at < int64(len(f.data)) && i < len(b) {
	// 	b[i] = f.data[f.at]
	// 	i++
	// 	f.at++
	// }
	// return i, nil
}
func (f *MemFileWrap) Seek(offset int64, whence int) (int64, error) {
	switch whence {
	case 0:
		f.at = offset
	case 1:
		f.at += offset
	case 2:
		f.at = int64(len(f.realFile.data)) + offset
	}
	return f.at, nil
}

type InMemoryFileInfo struct {
	file *memFileReal
}

// Name Implements os.FileInfo
func (s *InMemoryFileInfo) Name() string       { return s.file.Name }
func (s *InMemoryFileInfo) Size() int64        { return int64(len(s.file.data)) }
func (s *InMemoryFileInfo) Mode() os.FileMode  { return os.ModeTemporary }
func (s *InMemoryFileInfo) ModTime() time.Time { return time.Time{} }
func (s *InMemoryFileInfo) IsDir() bool        { return false }
func (s *InMemoryFileInfo) Sys() interface{}   { return nil }
