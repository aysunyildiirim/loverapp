# Aþk Uygulamasý Þablonu

Bu proje, sevgiliniz için özel olarak hazýrlanmýþ interaktif bir web uygulamasý þablonudur. Hafýza oyunu, yapboz, kalp yakalama, mayýn tarlasý gibi oyunlar, aþk çarký, müzik kutusu, yapýlacaklar listesi, aný defteri ve daha birçok özellik içerir.

## Özellikler

- ?? **Oyunlar**: Hafýza, Yapboz, Kalp Yakalama, Kiþiselleþtirilmiþ Mayýn Tarlasý
- ?? **Aþk Çarký**: Haftalýk sürpriz ödüller
- ?? **Müzik Kutusu**: Paylaþýlan þarkýlar
- ?? **Yapýlacaklar Listesi**: Gelecek planlarý
- ?? **Aný Defteri**: Özel anýlar
- ?? **Hayaller Bahçesi**: Ortak hayaller
- ?? **Gizli Oda**: Özel mesajlar
- ?? **Ýlk Yerimiz**: Buluþma yeri haritasý
- ?? **Huzur Butonu**: Mutluluk kontrolü

## Kurulum

1. Bu repoyu klonlayýn veya indirin.
2. 
pm install komutunu çalýþtýrýn.
3. Gerekli kiþisel bilgileri doldurun (aþaðýda detaylý anlatýlmýþ).

## Kiþiselleþtirme Adýmlarý

### 1. Ýsimleri Deðiþtirin
- src/App.jsx dosyasýnda [Sevgilinin Adý] ve [Senin Adýn] placeholder'larýný gerçek isimlerle deðiþtirin.
- Örnek: [Sevgilinin Adý] › Ayþe

### 2. Tarihleri Ayarlayýn
- Ýliþkinizin baþlangýç tarihini src/App.jsx'teki nniversaryDate deðiþkeninde güncelleyin.
- Format: 
ew Date(Yýl, Ay-1, Gün, Saat, Dakika)
- Örnek: 
ew Date(2020, 5, 15, 18, 30) (15 Haziran 2020, 18:30)

### 3. Þifreleri Belirleyin
- Ana giriþ þifresi: [Ýliþkinizin Baþlangýç Tarihi - GünAyYýl formatýnda, örneðin 21042017]
- Gizli oda þifresi: [Sevgilinizin sevdiði bir þey, örneðin þeftali]

### 4. Resimleri Deðiþtirin
- src/assets/ klasöründeki resimleri kendi resimlerinizle deðiþtirin.
- Hafýza oyunu için 8 resim: esim1.jpeg - esim8.jpeg
- Yapboz için: esim.jpeg
- Karakter resimleri: sen_normal.webp, sen_yakala.webp
- Diðer görseller: kurdeleli_kalp.png, dusen_kafa.webp
- Modal resimleri: irst-meet.jpeg, 	ea-sahlep.png, uzgun.jpeg, mutlu.jpeg

### 5. Müzik ve Videolarý Ekleyin
- public/ klasörüne video dosyalarýný ekleyin: huzur.mp4, gizli-oda-video.mp4
- public/nasa-gokyuzu.jpg dosyasýný deðiþtirin.

### 6. Harita ve Adres
- src/App.jsx'teki Google Maps embed URL'ini kendi buluþma yerinizle deðiþtirin.

### 7. Kiþisel Mesajlarý Düzenleyin
- loveReasons dizisini kendi nedenlerinizle doldurun.
- Gizli oda mektubundaki mesajlarý kiþiselleþtirin.
- Diðer mesajlarý (oyun bitiþleri, çark ödülleri vb.) düzenleyin.

### 8. Veritabaný Kurulumu
- Neon.tech veya benzeri PostgreSQL servisi kullanýn.
- .env dosyasýndaki DATABASE_URL'i kendi veritabaný URL'inizle deðiþtirin.
- Veritabanýnda þu tablolarý oluþturun:
  `sql
  CREATE TABLE paylasimlar (
    id SERIAL PRIMARY KEY,
    baslik TEXT,
    aciklama TEXT,
    resim_adi TEXT,
    tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE todo_list (
    id SERIAL PRIMARY KEY,
    text TEXT
  );

  CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title TEXT,
    artist TEXT
  );

  CREATE TABLE dreams (
    id SERIAL PRIMARY KEY,
    category TEXT,
    text TEXT
  );
  `

### 9. Sunucu Daðýtýmý
- Render.com veya benzeri platformda daðýtýn.
- API_BASE_URL'i daðýtým URL'inizle deðiþtirin.

## Çalýþtýrma

`ash
npm run dev  # Geliþtirme
npm run build  # Üretim derlemesi
npm run preview  # Üretim önizlemesi
`

Sunucu için:
`ash
node server.js
`

## Teknolojiler

- React + Vite
- Node.js + Express
- PostgreSQL
- Framer Motion
- Canvas Confetti
- Lucide Icons

## Lisans

Bu proje açýk kaynak kodludur. Kiþisel kullaným için ücretsizdir.
