"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { Camera, Upload, Music, BookOpen, Heart, Flower, Mail, ArrowLeft, Plus, X } from 'lucide-react';

// -- DEFINISI TIPE DATA --
interface Poem { title: string; author: string; lines: string[]; isUserAdded?: boolean; }
interface Quote { text: string; author: string; isUserAdded?: boolean; }
interface Memory { id: number; imageSrc: string; caption: string; date: string; }
interface Book { id: number; title: string; type: 'poems' | 'quotes' | 'memories'; content: any[]; }
interface Song { title: string; artist: string; }
interface FlowerInstance { id: number; name: string; emoji: string; collectedDate: string; imageSrc: string; fortune: string; }

// -- PROPS UNTUK KOMPONEN --
interface PolaroidCardProps { imageSrc: string; fortune: string; }
interface PoemCardProps { poem: Poem; }
interface QuoteCardProps { quote: Quote; }
interface SongCardProps { song: Song; }
interface TabButtonProps { id: string; icon: React.ElementType; label: string; }
interface MemoryCardProps { memory: Memory; }


// -- DATA KONTEN AWAL --
const fortuneMessages: string[] = [ "Hari ini, senyummu akan menjadi alasan seseorang ikut tersenyum.", "Jangan lupa, kamu lebih kuat dari yang kamu kira. Semangat Caca!", "Coba lihat ke luar jendela. Ada keindahan yang menunggumu hari ini.", "Energi positif sedang mengelilingimu. Manfaatkan dengan baik!", "Ingatlah untuk minum air yang cukup dan beristirahat. Kamu berharga.", "Sebuah kejutan kecil yang menyenangkan akan datang hari ini.", "Hari ini adalah hari yang sempurna untuk memulai sesuatu yang baru.", "Jangan takut untuk bersinar, kamu adalah bintangnya.", "Kebaikan kecil yang kamu lakukan hari ini akan kembali padamu.", "Lintang bilang: 'Kamu hebat banget hari ini!'", ];
const initialBooks: Book[] = [ { id: 1, title: "Puisi Penguat Hati", type: 'poems', content: [ { title: "Untukmu, Bunga yang Mekar", author: "Lintang", lines: [ "Di tengah riuh rendah dunia,", "Kau adalah hening yang paling berharga.", "Setiap kelopak dirimu adalah cerita,", "Tentang kekuatan yang tak pernah sirna.", "Mekarlah tanpa ragu, Caca.", ] }, { title: "Cermin Bukan Juri", author: "Lintang", lines: [ "Jangan biarkan cermin mendefinisikanmu,", "Karena ia hanya memantul apa yang terlihat.", "Keindahanmu ada pada caramu tertawa,", "Pada caramu bertahan saat dunia tak bersahabat.", "Kamu adalah puisi yang tak perlu dijelaskan." ] }, { title: "Langit Kelabu", author: "Lintang", lines: [ "Ada hari di mana langkah terasa berat,", "Dan langit tampak lebih kelabu dari biasanya.", "Ingatlah, bahkan bunga terindah pun butuh hujan.", "Badai ini hanya sedang menyiram akarmu,", "Agar esok kau bisa mekar lebih megah." ] }, ] }, { id: 2, title: "Kutipan Semangat", type: 'quotes', content: [ { text: "Satu-satunya perjalanan yang mustahil adalah yang tidak pernah kamu mulai.", author: "Tony Robbins" }, { text: "Jadilah versi terbaik dari dirimu sendiri.", author: "Anonim" }, { text: "Kebahagiaan bukan sesuatu yang sudah jadi. Itu berasal dari tindakanmu sendiri.", author: "Dalai Lama" }, ] }, { id: 3, title: "Memori Bersama", type: 'memories', content: [] } ];
const songs: Song[] = [
  { title: "ウヲアイニ", artist: "Shunji Iwai" },
  { title: "fish in the pool", artist: "Shunji Iwai" },
  { title: "ウヲアイニ・アラベスク", artist: "Shunji Iwai" },
  { title: "花とアリス", artist: "Shunji Iwai" },
  { title: "dancin' in the rain", artist: "Shunji Iwai" },
  { title: "花の季節", artist: "Shunji Iwai" },
  { title: "花の季節・うみ", artist: "Shunji Iwai" },
  { title: "Engagement Party", artist: "Justin Hurwitz" },
  { title: "City Of Stars (Humming)", artist: "Justin Hurwitz" },
  { title: "Frozen Summer (From Love Letter[Original Soundtrack]) - Live", artist: "Festival Orchestra" },
  { title: "Small Happiness (From Love Letter[Original Soundtrack]) - Live", artist: "Festival Orchestra" },
  { title: "Yakusoku", artist: "Gontiti" },
  { title: "Gold Coast Rhythm - Jack's Party", artist: "Justin Hurwitz" },
  { title: "Yumeji's Theme - 電影'花樣年華/ Instrumental", artist: "Shigueru Umebayashi" },
  { title: "Childhood Days (From Love Letter[Original Soundtrack]) - Live", artist: "Festival Orchestra" },
  { title: "Manny and Nellie's Theme", artist: "Justin Hurwitz" },
  { title: "Mia Gets Home", artist: "Justin Hurwitz" },
  { title: "Mia & Sebastian’s Theme (Late For The Date)", artist: "Justin Hurwitz" },
  { title: "It’s Over / Engagement Party", artist: "Justin Hurwitz" },
  { title: "Mia & Sebastian’s Theme (Celesta)", artist: "Justin Hurwitz" },
  { title: "Mia Hates Jazz", artist: "Justin Hurwitz" },
  { title: "House of Woodcock", artist: "Jonny Greenwood" },
  { title: "Mia & Sebastian’s Theme", artist: "Justin Hurwitz" },
  { title: "Spring Wind", artist: "Busker Busker" },
  { title: "エンドロール", artist: "Yoko Kanno" },
  { title: "13 jours en France (Orchestre) - 2008 Remastered Version", artist: "Francis Lai" },
  { title: "Clair de Lune", artist: "Kazumasa Hashimoto" },
  { title: "GOOD NIGHT - Piano Trio", artist: "Lee Jin Ah" },
  { title: "COOKING - Guitar Version", artist: "Sam Kim" },
  { title: "It's a Summer Film!", artist: "小田朋美" },
  { title: "花鈴組のテーマ", artist: "西田修大" },
  { title: "ライトスピード", artist: "OCHA∞ME" },
  { title: "はじまり", artist: "Vasia Hapi" },
  { title: "The Last Scene", artist: "Vasia Hapi" },
  { title: "腳踏車", artist: "Studio Musicians" },
  { title: "早操", artist: "Jay Chou" },
  { title: "淡水海邊", artist: "Studio Musicians" },
  { title: "父與子", artist: "Studio Musicians" },
  { title: "Secret(慢版)", artist: "黃婉琦" },
  { title: "小雨寫立可白I", artist: "Studio Musicians" },
  { title: "路小雨", artist: "Jay Chou" },
  { title: "Waltz of the Wind", artist: "YOONHAN" },
  { title: "Perspective", artist: "Takumi Kaneko" },
  { title: "Merry Future", artist: "We Are The Night" },
  { title: "This World Today", artist: "Takumi Kaneko" },
  { title: "Ode to Vivian - Rework", artist: "Patrick Watson" },
  { title: "Rose’s Theme", artist: "Toshihiko Sahashi" },
  { title: "Overture", artist: "Soichi Noriki" },
  { title: "Sometin’ About Myself", artist: "Toshihiko Sahashi" },
  { title: "Hoshi", artist: "Soichi Noriki" },
  { title: "Bokudakedemo", artist: "Soichi Noriki" },
  { title: "Meguriaetara", artist: "Toshihiko Sahashi" },
  { title: "From A Distance", artist: "Toshihiko Sahashi" },
  { title: "I’m Ａ Woman", artist: "Toshihiko Sahashi" },
  { title: "Jibunrashiku", artist: "Soichi Noriki" },
  { title: "Deai Soshite", artist: "Toshihiko Sahashi" },
  { title: "Boy Meets Boy…？", artist: "Toshihiko Sahashi" },
  { title: "Something’s Missing", artist: "Toshihiko Sahashi" },
  { title: "Feelin’ Blue", artist: "Soichi Noriki" },
  { title: "Can You Hear Me？", artist: "Soichi Noriki" },
  { title: "RT", artist: "Toshihiko Sahashi" },
  { title: "Hontouno Koto", artist: "Soichi Noriki" },
  { title: "(¡-¡)", artist: "Soichi Noriki" },
  { title: "Boy Meets Girl", artist: "Soichi Noriki" },
  { title: "memento", artist: "Teruyuki Nobuchika" },
  { title: "Untitled 9", artist: "Bremen Entertainment Inc." },
  { title: "wind", artist: "Yoko Komatsu" },
  { title: "Gerden", artist: "Takumi Kaneko" },
  { title: "Pain Is A Lover", artist: "缺省" },
  { title: "湖", artist: "加藤久貴" },
  { title: "(forever?????????)", artist: "glass beach" },
  { title: "Opening Scene", artist: "Chamsom" },
  { title: "Little Things", artist: "Adrián Berenguer" },
  { title: "Ladyfingers", artist: "Herb Alpert & The Tijuana Brass" },
  { title: "Hurwitz / Arr. Bouchard: La la land: Mia and Sebastian's Theme", artist: "Justin Hurwitz" },
  { title: "Theme From A Summer Place", artist: "Percy Faith & His Orchestra" },
  { title: "Constancy", artist: "Jay & Days" },
  { title: "Eternally", artist: "Jay & Days" },
  { title: "Stolen Heart", artist: "Jay & Days" },
  { title: "Only", artist: "Jay & Days" },
  { title: "True Love", artist: "Jay & Days" },
  { title: "Remember", artist: "Jay & Days" },
  { title: "Dreamer", artist: "Jay & Days" },
  { title: "Story Book", artist: "Jay & Days" },
  { title: "Scene I, Kyoto", artist: "Umitaro Abe" },
  { title: "seaside village", artist: "Kang Asol" },
  { title: "You", artist: "Vietra" },
  { title: "Alone Late at Night", artist: "Shigeru Nagata" },
  { title: "The Ocean Waves", artist: "Shigeru Nagata" },
  { title: "First Impression", artist: "Shigeru Nagata" },
  { title: "恋人とは・・・", artist: "Toshihiro Nakanishi" },
  { title: "A Girl's Thoughts", artist: "Shigeru Nagata" },
  { title: "MUJI2020", artist: "Ryuichi Sakamoto" },
  { title: "Ieta", artist: "Ryuichi Sakamoto" },
  { title: "Duet", artist: "Omori" },
  { title: "bagatelle no.2", artist: "Teruyuki Nobuchika" },
  { title: "Intermittent", artist: "Iwamura Ryuta" },
  { title: "Spencer", artist: "Jonny Greenwood" },
  { title: "Moon Flower", artist: "Maika Loubté" },
  { title: "lumiere", artist: "Kaede" },
  { title: "before the rain", artist: "Milena" },
  { title: "Minerva", artist: "Akira Kosemura" },
  { title: "September 16 / Es-dur", artist: "Iwamura Ryuta" },
  { title: "Musetta's Waltz", artist: "Giacomo Puccini" },
  { title: "Safflower - Piano Version", artist: "Katsu Hoshi" },
  { title: "mou", artist: "Teruyuki Nobuchika" },
  { title: "Stories of a Figure Skater - Day Off", artist: "Hikaru Shirosu" },
  { title: "Prelude No. 2, Op. 7 'Saxophone Quartet'", artist: "Hikaru Shirosu" },
  { title: "Dawn", artist: "Takumi Kaneko" },
  { title: "natsu", artist: "Yoko Komatsu" },
  { title: "山桜", artist: "Mine Kawakami" },
  { title: "Dare mo Shiranai", artist: "Gontiti" },
  { title: "Hiraku", artist: "Umitaro Abe" },
  { title: "Tenshi No Tamago", artist: "Albert Karch" },
  { title: "Higashi Yoshino", artist: "Oh Shu" },
  { title: "Sakura", artist: "Takahiro Kido" },
  { title: "Humming", artist: "akiko" },
  { title: "公園で", artist: "You Hee Yeol" },
  { title: "Flower Playing-Spring Version", artist: "Anan Ryoko" },
  { title: "24 Preludes, Op. 11: No. 1 in C Major", artist: "Alexander Scriabin" },
  { title: "A Mischievous Wind", artist: "Minuano" },
  { title: "A Town with an Ocean View", artist: "Joe Hisaishi" },
  { title: "Fletcher's Song", artist: "Justin Hurwitz" },
  { title: "初戀", artist: "Takeshi Senoo" },
  { title: "男はつらいよ", artist: "Takeshi Senoo" },
  { title: "サクラ咲ク", artist: "Takeshi Senoo" },
  { title: "エンドロール", artist: "Takeshi Senoo" },
  { title: "東京の屋根の下", artist: "Takeshi Senoo" },
  { title: "君の未来、僕の想い", artist: "Takeshi Senoo" },
  { title: "Just Give Me One More Day - Old Piano Version", artist: "Alej" },
  { title: "Souvenir d'Italie", artist: "Lelio Luttazzi" },
  { title: "Love Letter", artist: "Cavendish Music" },
  { title: "Summer in Paris", artist: "Cavendish Music" },
  { title: "Colette - Remastered 2022", artist: "Piero Piccioni" },
  { title: "Childhood memories", artist: "Luxid" },
  { title: "Otra Vez", artist: "ProdMarvin" },
  { title: "Petite Tonkinoise", artist: "Henri Christiné" },
  { title: "First Love", artist: "Luxid" },
  { title: "Romance", artist: "Luxid" },
  { title: "Flower petals", artist: "Luxid" },
  { title: "春蝉", artist: "Gontiti" },
  { title: "you stand before the sunset", artist: "haruka nakamura" },
  { title: "better day", artist: "haruka nakamura" },
  { title: "Someone's Night - Instrumental", artist: "Coffeeboy" },
  { title: "l'adieu", artist: "Epitone Project" },
  { title: "Melt", artist: "옐로우페이퍼" },
  { title: "Into the memories", artist: "Lee Gyu Ok" },
  { title: "오솔길", artist: "Jung Jae Hyung" },
  { title: "GOOD NIGHT", artist: "You Hee Yeol" },
  { title: "Asking Tomorrow", artist: "J Dawoon" },
  { title: "당신의 사랑이 늘 행복하기를.", artist: "By Jun" },
  { title: "Rainy day (Inst.) - Inst.", artist: "Light & Salt" },
  { title: "summer rust", artist: "orbe" },
  { title: "新しい朝", artist: "haruka nakamura" },
  { title: "Tutu", artist: "Keiichiro Shibuya" },
  { title: "夜想", artist: "江﨑文武" },
  { title: "無花果", artist: "Kadan" },
  { title: "September 16 / Es-dur(変ホ長調)", artist: "Iwamura Ryuta" },
  { title: "ある光", artist: "haruka nakamura" },
  { title: "花火", artist: "yuma yamaguchi" },
  { title: "tandem", artist: "冬にわかれて" },
  { title: "the light from the north", artist: "orbe" },
  { title: "双子虫Ⅰ", artist: "角銅真実" },
  { title: "flowers", artist: "haruka nakamura" },
  { title: "本音", artist: "yuma yamaguchi" },
  { title: "Corner of Memories", artist: "dom mino'" },
  { title: "Moonlit Winter", artist: "Kim Haewon" },
  { title: "Wandering In Dream", artist: "Kim Haewon" },
  { title: "草いろの朝", artist: "Takuro Kikuchi" },
  { title: "In the Mist", artist: "Tico Moon" },
  { title: "Afternoon Menuet", artist: "Itoko Toma" },
  { title: "I Said So", artist: "Takumi Kaneko" },
  { title: "Petals in a Breeze", artist: "Itoko Toma" },
  { title: "Sophie’s Garden", artist: "Sagong" },
  { title: "teacup ride", artist: "Tico Moon" },
  { title: "Prairie Home Suite Part 3", artist: "the sleeping beauty" },
  { title: "Blue Stone of Atlas - Piano Solo Version", artist: "Hikaru Shirosu" },
  { title: "Prelude No. 3, Final Stars", artist: "Hikaru Shirosu" },
  { title: "Hustle and Bustle", artist: "Gontiti" },
  { title: "Solitude", artist: "Janis Crunch" },
  { title: "Sunflower Dance", artist: "Green-House" },
  { title: "Amore", artist: "Ryuichi Sakamoto" },
];
const flowerTypes = [ { name: 'Mawar', emoji: '🌹' }, { name: 'Tulip', emoji: '🌷' }, { name: 'Matahari', emoji: '🌻' }, { name: 'Sakura', emoji: '🌸' }, { name: 'Hibiscus', emoji: '🌺' }, { name: 'Teratai', emoji: '🪷' }, ];
const secretLetterMessage = "Hai Caca, kalau kamu nemu ini, berarti kamu jeli banget! Cuma mau bilang, Lintang sayang banget sama kamu. Semoga harimu indah ya!";

// Hook untuk menggunakan localStorage
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}

// -- KOMPONEN-KOMPONEN KECIL --
const PolaroidCard: React.FC<PolaroidCardProps> = ({ imageSrc, fortune }) => ( <div className="bg-white p-4 pb-14 shadow-xl rounded-sm transform -rotate-3 hover:rotate-0 transition-transform duration-300 w-full max-w-sm mx-auto"> <div className="relative w-full h-80 bg-gray-200 rounded-sm overflow-hidden"><img src={imageSrc} alt="Selfie Caca" className="w-full h-full object-cover" /></div> <p className="text-center mt-6 text-gray-700 font-serif italic text-lg px-2">"{fortune}"</p> </div> );
const PoemCard: React.FC<PoemCardProps> = ({ poem }) => ( <div className="bg-rose-50 border border-rose-200 p-6 rounded-lg shadow-md w-full"><h3 className="text-2xl font-bold text-rose-800 font-serif mb-2">{poem.title}</h3><p className="text-sm text-rose-500 mb-4">oleh: {poem.author}</p><div className="space-y-2">{poem.lines.map((line, index) => (<p key={index} className="text-gray-700">{line}</p>))}</div></div> );
const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => ( <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg shadow-md w-full"><p className="text-xl italic text-gray-700">"{quote.text}"</p><p className="text-right mt-4 text-amber-700 font-semibold">- {quote.author}</p></div> );
const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => ( <div className="relative bg-white p-4 pb-10 shadow-lg rounded-sm w-full max-w-sm mx-auto transform -rotate-2 hover:rotate-0 transition-transform duration-300"> <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-200/50 backdrop-blur-sm border-l border-r border-yellow-300/50 transform -rotate-3 shadow-sm"></div> <div className="relative w-full h-72 bg-gray-200 rounded-sm overflow-hidden"> <img src={memory.imageSrc} alt="Memori" className="w-full h-full object-cover" /> <p className="absolute bottom-2 right-2 text-xs bg-black/40 text-white px-1.5 py-0.5 rounded font-sans">{memory.date}</p> </div> <p className="text-center mt-4 text-gray-700 font-serif text-base px-2">{memory.caption}</p> <span className="absolute -bottom-3 -right-3 text-5xl transform rotate-12 drop-shadow">🌸</span> </div> );
const SongCard: React.FC<SongCardProps> = ({ song }) => ( <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto flex items-center space-x-6 border-2 border-pink-200 transform hover:scale-105 transition-transform duration-300"><div className="flex-shrink-0"><div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-inner"><Music className="text-white w-8 h-8" /></div></div><div><p className="text-gray-500 text-sm">Lagu untukmu saat ini:</p><h3 className="text-2xl font-bold text-gray-800">{song.title}</h3><p className="text-gray-600 text-lg">{song.artist}</p></div></div> );

// -- KOMPONEN UTAMA --
export default function App() {
  // State Utama
  const [activeTab, setActiveTab] = useState('absen');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showSecretLetter, setShowSecretLetter] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [viewedFlower, setViewedFlower] = useState<FlowerInstance | null>(null);
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  // State yang disimpan di localStorage
  const [flowers, setFlowers] = useStickyState<FlowerInstance[]>([], 'caca-flowers');
  const [books, setBooks] = useStickyState<Book[]>(initialBooks, 'caca-books');
  const [lastUploadDate, setLastUploadDate] = useStickyState<string | null>(null, 'caca-lastUpload');

  // State tanggal hari ini (client only)
  const [today, setToday] = useState('');
  useEffect(() => {
    setToday(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  // Cek apakah hari ini sudah upload
  const hasUploadedToday = lastUploadDate === today;

  // Logika Lagu per 15 menit
  useEffect(() => {
    const updateSong = () => {
      const minutesSinceEpoch = Math.floor(Date.now() / 60000);
      const interval15min = Math.floor(minutesSinceEpoch / 15);
      const songIndex = interval15min % songs.length;
      setCurrentSong(songs[songIndex]);
    };
    updateSong();
    const timer = setInterval(updateSong, 60000); // Cek tiap menit
    return () => clearInterval(timer);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadConfirm = () => {
    if (hasUploadedToday) {
      alert("Caca sudah absen hari ini, coba lagi besok ya!");
      return;
    }
    if (photoPreview && today) {
      const newFortune = fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)];
      const randomFlower = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const newFlower: FlowerInstance = { id: Date.now(), name: randomFlower.name, emoji: randomFlower.emoji, collectedDate: today, imageSrc: photoPreview, fortune: newFortune, };
      setFlowers(prev => [...prev, newFlower]);
      setLastUploadDate(today);
      setPhotoPreview(null);
      alert("Absen berhasil! Bunga baru telah tumbuh di tamanmu.");
      setActiveTab('taman');
    }
  };
  
  const handleAddMemory = (imageSrc: string, caption: string) => {
    if (!today) return;
    const newMemory: Memory = {
      id: Date.now(),
      imageSrc,
      caption,
      date: today
    };
    let newActiveBook: Book | null = null;
    const updatedBooks = books.map(book => {
        if (book.type === 'memories') {
            const updatedBook = {...book, content: [newMemory, ...book.content]};
            newActiveBook = updatedBook;
            return updatedBook;
        }
        return book;
    });
    setBooks(updatedBooks);
    if(newActiveBook) setActiveBook(newActiveBook);
  };
  
  const handleAddContent = (bookType: 'poems' | 'quotes', content: Poem | Quote) => {
     let newActiveBook: Book | null = null;
     const updatedBooks = books.map(book => {
        if (book.type === bookType) {
            const updatedBook = {...book, content: [...book.content, content]};
            newActiveBook = updatedBook;
            return updatedBook;
        }
        return book;
    });
    setBooks(updatedBooks);
    if(newActiveBook) setActiveBook(newActiveBook);
  };
  
  const handleOpenBook = (book: Book) => {
    setActiveBook(book);
    setShowAddForm(false);
  }

  const TabButton: React.FC<TabButtonProps> = ({ id, icon: Icon, label }) => ( <button onClick={() => { setActiveTab(id); setActiveBook(null); }} className={`flex flex-col items-center justify-center space-y-1 w-full py-3 rounded-lg transition-all duration-300 ${ activeTab === id ? 'bg-pink-500 text-white shadow-lg' : 'bg-white/50 text-pink-700 hover:bg-white' }`}> <Icon className="w-6 h-6" /><span className="text-xs font-semibold">{label}</span> </button> );

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-gray-800">
        <div className="fixed inset-0 bg-repeat bg-center opacity-30" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FBCFE8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
        {/* Modals */}
        {showSecretLetter && ( <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowSecretLetter(false)}> <div className="bg-rose-50 p-8 rounded-lg shadow-2xl max-w-md w-full font-serif text-center relative" onClick={e => e.stopPropagation()}> <h3 className="text-2xl font-bold text-rose-800 mb-4">Sebuah Surat Untukmu...</h3> <p className="text-gray-700 text-lg">{secretLetterMessage}</p> <button onClick={() => setShowSecretLetter(false)} className="mt-6 bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors">Tutup</button> </div> </div> )}
        {viewedFlower && ( <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewedFlower(null)}> <div className="relative" onClick={e => e.stopPropagation()}> <PolaroidCard imageSrc={viewedFlower.imageSrc} fortune={viewedFlower.fortune} /> <button onClick={() => setViewedFlower(null)} className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg"><X className="w-5 h-5 text-gray-600"/></button> </div> </div> )}
        <button onClick={() => setShowSecretLetter(true)} className="fixed top-4 right-4 z-40 animate-bounce bg-white p-2 rounded-full shadow-lg hover:animate-none"> <Mail className="w-6 h-6 text-rose-400"/> </button>
        
        <div className="relative z-10 flex flex-col min-h-screen">
            <header className="text-center py-8"><h1 className="text-4xl md:text-5xl font-bold text-pink-600 font-serif">Caca's Playground</h1><p className="text-pink-400 mt-2 flex items-center justify-center">dibuat dengan <Heart className="w-4 h-4 mx-1.5 fill-current" /> oleh Lintang</p></header>
            <main className="flex-grow p-4 md:p-8">
                {activeTab === 'absen' && (<div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">{!photoPreview ? (<><h2 className="text-2xl font-semibold text-center text-pink-800">Absen dulu yuk, Caca!</h2> {hasUploadedToday ? (<p className="text-center bg-rose-100 p-4 rounded-lg">Kamu sudah absen hari ini. Sampai jumpa besok!</p>) : (<label htmlFor="selfie-upload" className="cursor-pointer group"><div className="w-64 h-64 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-dashed border-pink-300 group-hover:border-pink-500 group-hover:scale-105 transition-all duration-300"><Camera className="w-20 h-20 text-pink-300 group-hover:text-pink-500 transition-colors" /><span className="mt-4 font-semibold text-pink-600">Pilih Foto</span></div></label>)} <input id="selfie-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} /></>) : (<div className="text-center"><h2 className="text-2xl font-semibold text-pink-800 mb-4">Pratinjau Foto</h2><img src={photoPreview} alt="Pratinjau" className="max-w-xs w-full rounded-lg shadow-lg mx-auto" /><div className="flex gap-4 mt-6 justify-center"><button onClick={() => setPhotoPreview(null)} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400">Batal</button><button onClick={handleUploadConfirm} className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 flex items-center gap-2"><Upload className="w-5 h-5"/>Upload</button></div></div>)}</div>)}
                {activeTab === 'taman' && (<div className="animate-fade-in text-center"><h2 className="text-3xl font-bold text-center text-pink-800 font-serif mb-8">Taman Bunga Caca</h2>{flowers.length === 0 ? (<p className="text-gray-500">Tamanmu masih kosong. Upload fotomu untuk menanam bunga pertama!</p>) : (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{flowers.map(flower => (<button key={flower.id} onClick={() => setViewedFlower(flower)} className="bg-white/70 p-4 rounded-lg shadow-md flex flex-col items-center justify-center aspect-square animate-fade-in hover:scale-105 hover:shadow-xl transition-all"><span className="text-5xl">{flower.emoji}</span><p className="font-bold mt-2 text-pink-700">{flower.name}</p><p className="text-xs text-gray-500">{flower.collectedDate}</p></button>))}</div>)}</div>)}
                {activeTab === 'rak' && (<div className="animate-fade-in"><h2 className="text-3xl font-bold text-center text-pink-800 font-serif mb-8">{activeBook ? activeBook.title : "Rak Buku Interaktif"}</h2>{activeBook ? (<div><button onClick={() => setActiveBook(null)} className="flex items-center gap-2 mb-6 text-pink-600 hover:underline"><ArrowLeft size={16}/>Kembali ke Rak</button><div className="space-y-6">{(activeBook.content as any[]).map((item, idx) => { if (activeBook.type === 'poems') return <PoemCard key={idx} poem={item}/>; if (activeBook.type === 'quotes') return <QuoteCard key={idx} quote={item}/>; if (activeBook.type === 'memories') return <MemoryCard key={item.id} memory={item}/>; return null; })} {!showAddForm && (<button onClick={() => setShowAddForm(true)} className="w-full flex items-center justify-center gap-2 p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors mt-8"><Plus size={20} /><span>Tambah Baru</span></button>)} {showAddForm && (<> {activeBook.type === 'memories' && (<AddMemoryForm onAdd={handleAddMemory} onCancel={() => setShowAddForm(false)} />)} {activeBook.type === 'poems' && <AddContentForm type="poem" onAdd={handleAddContent} onCancel={() => setShowAddForm(false)}/>} {activeBook.type === 'quotes' && <AddContentForm type="quote" onAdd={handleAddContent} onCancel={() => setShowAddForm(false)}/>} </>)}</div></div>) : (<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">{books.map(book => (<button key={book.id} onClick={() => handleOpenBook(book)} className="p-6 bg-rose-100 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-rose-800 font-serif font-bold text-xl text-center">{book.title}</button>))}</div>)}</div>)}
                {activeTab === 'song' && (<div className="flex flex-col items-center justify-center animate-fade-in space-y-6"><h2 className="text-3xl font-bold text-center text-pink-800 font-serif">Melodi Saat Ini</h2><SongCard song={currentSong} /></div>)}
            </main>
            <nav className="sticky bottom-0 left-0 right-0 bg-white/70 backdrop-blur-sm p-2 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]"><div className="max-w-md mx-auto grid grid-cols-4 gap-2"> <TabButton id="absen" icon={Camera} label="Absen" /> <TabButton id="taman" icon={Flower} label="Taman" /> <TabButton id="rak" icon={BookOpen} label="Rak Buku" /> <TabButton id="song" icon={Music} label="Lagu" /> </div></nav>
        </div>
        <style>{`@keyframes fade-in {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fade-in .5s ease-out forwards}.font-serif{font-family:'Lora',serif}.font-sans{font-family:'Inter',sans-serif}`}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
    </div>
  );
}

// -- KOMPONEN FORM TAMBAHAN --
function AddMemoryForm({ onAdd, onCancel }: { onAdd: (imageSrc: string, caption: string) => void, onCancel: () => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropping, setCropping] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setRawFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
      setCropping(true);
    }
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Utility to get cropped image as data URL
  const getCroppedImg = async (imageSrc: string, crop: Area): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No ctx');
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        resolve(canvas.toDataURL('image/jpeg'));
      };
      image.onerror = () => reject('Image load error');
    });
  };

  const handleCropSave = async () => {
    if (image && croppedAreaPixels) {
      const cropped = await getCroppedImg(image, croppedAreaPixels);
      setImage(cropped);
      setCropping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (image && caption && !cropping) {
      onAdd(image, caption);
      onCancel();
    } else if (cropping) {
      alert('Selesaikan crop foto dulu!');
    } else {
      alert("Harap pilih foto dan isi kata-katanya ya.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-purple-50 border border-purple-200 p-6 rounded-lg shadow-md w-full mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-800 font-serif">Tambah Memori Baru</h3>
        <button type="button" onClick={onCancel} className="p-1 rounded-full hover:bg-purple-100"><X size={20} className="text-purple-600"/></button>
      </div>
      <div className="space-y-4">
        <label htmlFor="memory-upload" className="cursor-pointer block w-full p-4 text-center border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-100">
          {image ? 'Ganti Foto' : 'Pilih Foto'}
        </label>
        <input id="memory-upload" type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {image && cropping && (
                    <div className="relative w-full h-64 bg-gray-200 rounded-lg mx-auto">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={3/4}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                        <div
                          className="absolute left-0 right-0 bottom-0 z-20 flex flex-col items-center bg-white/90 py-3 px-2 rounded-b-lg"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <div className="flex items-center gap-4 w-full justify-center">
                            <input
                              type="range"
                              min={1}
                              max={3}
                              step={0.01}
                              value={zoom}
                              onChange={e => setZoom(Number(e.target.value))}
                              className="w-32"
                            />
                            <button
                              type="button"
                              onClick={handleCropSave}
                              className="bg-purple-500 text-white px-4 py-1 rounded-full hover:bg-purple-600 shadow"
                            >
                              Simpan Crop
                            </button>
                          </div>
                        </div>
                    </div>
                )}
        {image && !cropping && <img src={image} alt="Preview Memori" className="max-w-xs w-full rounded-lg mx-auto" />}
        <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Tulis kata-katamu di sini..." rows={3} className="w-full p-2 border border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500"/>
        <button type="submit" className="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-600 flex items-center justify-center gap-2"><Plus className="w-5 h-5"/>Simpan Memori</button>
      </div>
    </form>
  );
}

function AddContentForm({ type, onAdd, onCancel }: { type: 'poem' | 'quote', onAdd: (type: 'poems' | 'quotes', content: Poem | Quote) => void, onCancel: () => void }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Caca');
    const [lines, setLines] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'poem' && title && lines) {
            onAdd('poems', { title, author, lines: lines.split('\n'), isUserAdded: true });
            onCancel();
        } else if (type === 'quote' && lines) {
            onAdd('quotes', { text: lines, author, isUserAdded: true });
            onCancel();
        } else {
            alert("Harap isi semua bagian ya.");
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-md w-full mt-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-green-800 font-serif">Tulis {type === 'poem' ? 'Puisi' : 'Kutipan'} Karyamu</h3>
                <button type="button" onClick={onCancel} className="p-1 rounded-full hover:bg-green-100"><X size={20} className="text-green-600"/></button>
            </div>
            <div className="space-y-4">
                {type === 'poem' && <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul Puisimu" className="w-full p-2 border border-green-300 rounded-md"/>}
                <textarea value={lines} onChange={e => setLines(e.target.value)} placeholder={type === 'poem' ? "Tulis bait puisimu di sini...\nGunakan Enter untuk baris baru" : "Tulis kutipanmu di sini..."} rows={4} className="w-full p-2 border border-green-300 rounded-md"/>
                <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Namamu" className="w-full p-2 border border-green-300 rounded-md"/>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 flex items-center justify-center gap-2"><Plus className="w-5 h-5"/>Simpan Karyamu</button>
            </div>
        </form>
    );
}