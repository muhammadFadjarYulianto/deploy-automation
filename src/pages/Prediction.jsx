import React, {useState, useRef, useCallback, useEffect} from "react";
import UploadIcon from "../assets/images/upload-cloud.svg";
import Webcam from "react-webcam";
import {Button} from "@/components/ui/button";
import {Typography} from "@/components/ui/Typography";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {gsap} from "gsap";

gsap.registerPlugin(ScrollTrigger);
import Kaca from "../assets/images/kaca.png";
import Kardus from "../assets/images/kardus.png";
import Kertas from "../assets/images/kertas.png";
import Metal from "../assets/images/metal.png";
import Organik from "../assets/images/organik.png";
import Plastik from "../assets/images/plastik.png";
import CloseIcon from "../assets/images/x-square.svg";
import Craft from "../assets/images/craft.png";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {uploadImage} from "@/services/uploadService"; // Mengimpor service upload
import Loading from "../components/loading";
import {getProducts} from "@/services/product";

const CardSampah = [
    {
        id: 1,
        img: Kardus,
        heading: "Kardus atau Cardboard",
        subHeading: "Kertas dengan bahan tebal",
    },
    {
        id: 2,
        img: Kaca,
        heading: "Kaca",
        subHeading: "Sampah berbahan dasar kaca",
    },
    {
        id: 3,
        img: Metal,
        heading: "Metal",
        subHeading: "Sampah berbahan metal seperti kaleng",
    },
    {
        id: 4,
        img: Kertas,
        heading: "Kertas",
        subHeading: "Majalah, koran bekas, kertas bekas",
    },
    {
        id: 5,
        img: Plastik,
        heading: "Plastik",
        subHeading: "Sampah berbahan dasar plastik",
    },
    {
        id: 6,
        img: Organik,
        heading: "Organik",
        subHeading: "Sisa-sisa makanan, sampah dapur",
    },
];

const CaraPengolahan = {
    organic: [
        "Buat Kompos dari Sisa Makanan - Alihkan sisa makanan seperti kulit buah dan sayuran menjadi kompos. Ini adalah cara cerdas untuk mengubah sampah menjadi pupuk alami yang kaya nutrisi, sempurna untuk kebun Anda!",
        "Donasi Makanan yang Masih Layak Konsumsi: Punya makanan berlebih yang masih segar? Donasikan ke lembaga sosial agar orang lain bisa menikmatinya. Dengan begitu, Anda juga membantu mengurangi pemborosan makanan",
        "Perencanaan Porsi dan Pembelian: Kurangi sisa makanan dengan merencanakan belanjaan dan porsi dengan bijak. Ini tidak hanya menghemat uang, tapi juga mengurangi sampah yang Anda hasilkan.",
        "Pisahkan Sampah untuk Daur Ulang: Memisahkan sampah organik dari yang non-organik adalah langkah pertama untuk membuat proses daur ulang menjadi lebih mudah dan efektif. Pastikan sisa makanan tidak tercampur dengan plastik!",
    ],
    paper: [
        "Upcycling - Kertas bekas tidak harus langsung dibuang. Coba buat kertas baru dari pulp atau gunakan untuk kerajinan tangan seperti dekorasi atau bingkai foto. Seru, kan?",
        "Kerajinan Tangan - Gunakan kertas bekas untuk membuat karya seni atau dekorasi kreatif. Misalnya, gunakan teknik quilling untuk membuat bunga atau bingkai gambar unik!",
        "Pengomposan - Kertas tidak hanya bisa didaur ulang, tapi juga bisa menjadi bagian dari kompos. Campurkan dengan sampah organik lain untuk membuat pupuk alami yang bermanfaat.",
        "Pengurangan - Hemat kertas dengan melakukan verifikasi dokumen sebelum mencetak, menggunakan kedua sisi kertas, atau mencetak hanya yang diperlukan. ",
        "Menjual kembali - Sama seperti kardus, kertas bekas dapat dijual kembali kepada para pengepul atau pengrajin yang membutuhkan bahan baku kertas.",
    ],
    metal: [
        "Sumbangkan Peralatan Logam Lama – Daripada membuang panci atau wajan logam yang sudah tidak terpakai, coba sumbangkan ke teman, keluarga, atau toko amal. Barang-barang logam lama bisa sangat berguna bagi mereka yang membutuhkan!.",
        "Gunakan Kaleng Bekas untuk Tanaman – Kaleng bekas, seperti kaleng makanan atau minuman, bisa diubah menjadi pot tanaman yang cantik. Cukup bersihkan kaleng, beri lubang di bagian bawah untuk drainase, dan Anda siap menanam tanaman hias atau sayuran!",
        "Ciptakan Karya Seni dengan Logam Bekas – Alihkan kaleng, tutup botol, atau benda logam bekas lainnya menjadi karya seni yang unik! Anda bisa membuat patung kecil, dekorasi dinding, atau bahkan lampu hias dari bahan logam yang tidak terpakai.",
        "Reparasi – Jika Anda memiliki keterampilan, logam bekas bisa digunakan untuk membuat alat atau peralatan baru. Misalnya, Anda bisa membuat rak dari pipa logam bekas atau alat-alat kecil seperti sekop atau penggaruk dari kaleng bekas.",
    ],
    cardboard: [
        "Daur ulang - Pisahkan kardus dari bahan pembungkus lain, seperti plastik, busa, atau tali. Kemudian, lipat dan ikat kardus bekas dengan kardus lain. Simpan di tempat bersih dan kering, lalu berikan kepada pemulung.",
        "Pengomposan - Campur kardus dengan limbah organik lain, seperti daun, ranting, dan sisa makanan. Proses pengomposan membutuhkan waktu beberapa minggu hingga bulan. ",
        "Mengemas dan menyimpan barang - Kardus bekas dapat digunakan untuk mengemas dan menyimpan barang-barang selama kondisinya masih bagus dan tidak basah.  ",
        "Menjual kembali - Kardus bekas dapat dijual kembali kepada para pengepul atau pengrajin yang membutuhkan bahan baku kardus.  ",
    ],
    glass: [
        "Daur Ulang Botol Kaca - Bawa ke Tempat Pengumpulan Daur Ulang: Banyak daerah yang menyediakan fasilitas untuk menerima botol kaca yang sudah dipilah. Anda bisa membawa botol kaca ke pusat daur ulang atau bank sampah setempat.",
        "Upcycling - Gunakan botol kaca bekas untuk membuat kerajinan tangan, seperti pot tanaman, lampu hias, vas bunga, atau tempat lilin atau untuk menyimpan air, jus, atau minuman lain di rumah, sehingga mengurangi kebutuhan akan kemasan plastik sekali pakai.",
        "Dekorasi Rumah -  Botol kaca bisa dihias atau dicat untuk dijadikan dekorasi rumah, misalnya sebagai vas bunga atau lampu hias. Botol kaca juga bisa digunakan sebagai elemen dekoratif di taman atau halaman atau bisa juga dijadikan lampu gantung atau lampu meja dengan sedikit kreativitas. Ini bisa menjadi tambahan estetika di rumah.",
        "Mengurangi Pembelian Produk dalam Kemasan Kaca - Cobalah untuk mengurangi pembelian produk yang kemasannya hanya sekali pakai, meski dalam botol kaca, dengan memilih produk dalam kemasan besar atau menggunakan wadah sendiri untuk mengurangi limbah.",
    ],
    plastic: [
        "Daur Ulang Plastik - Daur ulang adalah cara terbaik untuk mengurangi jumlah sampah plastik yang masuk ke tempat pembuangan akhir (TPA). Plastik yang sudah digunakan bisa diproses untuk menjadi produk baru.",
        "Upcycling - Alihkan plastik bekas untuk upcycling, yaitu mengubahnya menjadi barang yang lebih berguna, seperti tempat penyimpanan, rak, atau karya seni. ",
        "Plastik Biodegradable - Pilih produk dengan kemasan plastik biodegradable atau yang ramah lingkungan jika memungkinkan, untuk mengurangi dampak sampah plastik yang sulit terurai. ",
        "Recycle Crafting - Selain upcycling, kerajinan plastik juga bisa menjadi cara kreatif untuk memanfaatkan sampah plastik, seperti membuat gelang, hiasan dinding, atau tas dari kantong plastik bekas. ",
    ],
};

const InformasiLengkap = {
    paper: {
        contohSampah: "Buku tulis bekas, Koran, Kertas kemasan",
        masaLama: "2-6 Minggu",
        tingkatBahaya: "Rendah",
        dampakLingkungan: "Deforestasi, pencemaran udara jika dibakar",
        tingkatRecycleability: "70-80% bisa didaur ulang",
    },
    cardboard: {
        contohSampah: "Kemasan kardus, kotak kemasan",
        masaLama: "2-6 Minggu",
        tingkatBahaya: "Rendah",
        dampakLingkungan:
            "Deforestasi, penggunaan energi untuk memproduksi kardus baru",
        tingkatRecycleability: "80-90% dapat didaur ulang",
    },
    glass: {
        contohSampah: "Kaca, Botol Kaca, Pecahan kaca, gelas",
        masaLama: "1 juta tahun",
        tingkatBahaya: "Sedang (selama tidak pecah)",
        dampakLingkungan: "Sulit bahkan tidak dapat teruarai di alam",
        tingkatRecycleability: "100% bisa didaur ulang",
    },
    plastic: {
        contohSampah: "Kantong plastik, botol, kemasan, sendok, tas kresek",
        masaLama: "500-1000 tahun",
        tingkatBahaya: "Sedang hingga tinggi",
        dampakLingkungan:
            "Polusi plastik di laut, pencemaran tanah, karsinogenik jika dibakar",
        tingkatRecycleability: "30-50% dapat didaur ulang",
    },
    metal: {
        contohSampah: "Kaleng, botol aluminium, produk logam lainnya",
        masaLama: "1000 tahun",
        tingkatBahaya: "Tinggi",
        dampakLingkungan: "Polusi logam berat jika dibuang sembarangan",
        tingkatRecycleability: "90-100% dapat didaur ulang",
    },
    organic: {
        contohSampah: "Sisa makanan, daun, kulit buah atau sayuran",
        masaLama: "1-3 minggu",
        tingkatBahaya: "Rendah",
        dampakLingkungan: "Pembusukan di tempat terbuka, pencemaran bau",
        tingkatRecycleability: "100% dapat terurai dan digunakan kembali",
    },
};

// Komponen untuk setiap baris tabel
const TableRow = ({label, value}) => (
    <tr className="">
        <td className="px-2 py-1">
            <Typography variant="p-semibold" className="font-bold text-emerald-600">
                {label}
            </Typography>
        </td>
        <td className="px-2 py-1">
            <Typography variant="p" className="font-bold text-emerald-600">
                :
            </Typography>
        </td>
        <td className="px-2 py-1">
            <Typography variant="p-reguler" className="text-emerald-600">
                {value}
            </Typography>
        </td>
    </tr>
);

const Prediction = () => {
    const heroSectionRef = useRef(null);
    const classtificationRef = useRef([]);
    const [products, setProducts] = useState([]);
    const [imgPreview, setImgPreview] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isNullImg, setIsNullImg] = useState(false);
    const [isPrediction, setIsPrediction] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [isFileInput, setIsFileInput] = useState(false); // Menandakan jenis input yang dipilih
    const webcamRef = useRef(null);

    // Fungsi untuk menangani perubahan file gambar
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                // Maksimal ukuran file 2MB
                setIsError(true);
                setImgPreview(null);
                setIsPrediction(false);
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setIsFileInput(true); // Menandakan input dari file
        }
    };

    // Fungsi untuk menangani pengambilan gambar dari kamera
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (typeof imageSrc === "string") {
            setImgSrc(imageSrc);
            setIsFileInput(false); // Menandakan input dari kamera
        }
    }, []);

    // Menentukan kategori berdasarkan hasil prediksi
    const getCategory = (prediction) => {
        const anorganikCategories = [
            "glass",
            "plastic",
            "paper",
            "metal",
            "cardboard",
        ];
        const category = anorganikCategories.includes(prediction)
            ? "Anorganik"
            : "Organik";
        return category;
    };

    // Fungsi untuk mengirim gambar (baik dari file atau kamera)
    const handleSubmit = async (event) => {
        event.preventDefault();

        let imageData;
        if (isFileInput && imgPreview) {
            imageData = imgPreview; // Gambar dari file upload
            setIsNullImg(false);
            setIsError(false);
        } else if (imgSrc) {
            imageData = imgSrc; // Gambar dari capture kamera
            setIsNullImg(false);
            setIsError(false);
        } else {
            setIsNullImg(true);
            return;
        }
        setImagePreview(imageData);
        setIsLoading(true);
        try {
            const response = await uploadImage(imageData);
            console.log(response);
            setPredictionResult(response);
            setIsPrediction(true); // Tampilkan hasil prediksi
            setIsLoading(false);
        } catch (error) {
            console.error("Error during image upload:", error);
        }
    };

    const dataTabel = [
        {
            label: "Kategori",
            value: predictionResult?.prediction
                ? getCategory(predictionResult.prediction)
                : "Belum ada data",
        },
        {
            label: "Masa Lama",
            value: predictionResult?.prediction
                ? InformasiLengkap[predictionResult.prediction]?.masaLama
                : "Belum ada data",
        },
        {
            label: "Contoh Sampah",
            value: predictionResult?.prediction
                ? InformasiLengkap[predictionResult.prediction]?.contohSampah
                : "Belum ada data",
        },
        {
            label: "Tingkat Bahaya",
            value: predictionResult?.prediction
                ? InformasiLengkap[predictionResult.prediction]?.tingkatBahaya
                : "Belum ada data",
        },
        {
            label: "Risiko Dampak",
            value: predictionResult?.prediction
                ? InformasiLengkap[predictionResult.prediction]?.dampakLingkungan
                : "Belum ada data",
        },
        {
            label: "Peluang Recycle",
            value: predictionResult?.prediction
                ? InformasiLengkap[predictionResult.prediction]?.tingkatRecycleability
                : "Belum ada data",
        },
    ];

    useEffect(() => {
        gsap.timeline({
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top 80%",
                end: "bottom top",
                toggleActions: "play none none none",
            },
        })
            .fromTo(
                ".hero-title",
                {opacity: 0, x: 50},
                {opacity: 1, x: 0, duration: 0.8, ease: "power2.out"}
            )
            .fromTo(
                ".hero-description",
                {opacity: 0, y: 50},
                {opacity: 1, y: 0, duration: 0.8, ease: "power2.out"},
                "-=0.4"
            )

        classtificationRef.current.forEach((step, index) => {
            gsap.fromTo(
                step,
                {opacity: 0, x: 100},
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.0,
                    delay: index * 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: step,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const name = predictionResult?.prediction;
                const data = await getProducts(name ? {category_name: name} : {});
                console.log("Fetched Products:", data.products);
                // Log full product data to inspect structure
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);


    // Fungsi untuk mendapatkan gambar berdasarkan kategori dari produk

    const getCraftImagesByCategory = (prediction) => {
        // Map prediction result to category name
        const categoryMapping = {
            'glass': 'Glass',
            'plastic': 'Plastic',
            'paper': 'Paper',
            'metal': 'Metal',
            'cardboard': 'Cardboard'
        };

        const categoryName = categoryMapping[prediction];

        // Filter products based on the mapped category name
        const filteredProducts = products.filter((prod) =>
            prod.category_name.toLocaleLowerCase() === categoryName
        );

        console.log("Filtered Products:", filteredProducts);
        console.log("Prediction:", prediction);
        console.log("Mapped Category:", categoryName);

        return filteredProducts.map((prod) => prod.img_file);
    };


    return (
        <main>
            {/* Title */}
            <div className="w-full mt-[99px] h-auto flex flex-col items-center gap-[33px]">
                <div className="max-w-3x1 text-center lg:text-center">
                    <Typography variant="title" className="hero-title">
                        <strong className="text-emerald-700">Prediksi</strong> Sampah
                    </Typography>
                </div>
                <div className="max-w-4xl text-center lg:text-center">
                    <Typography variant="p" className="hero-description">
                        Sistem canggih kami akan menganalisis gambar dan memberikan saran
                        pengelolaan sampah yang tepat, mulai dari pemilahan hingga metode
                        daur ulang yang ramah lingkungan. Dengan teknologi ini, mengelola
                        sampah menjadi lebih mudah dan efisien, membantu Anda berperan aktif
                        dalam menjaga kebersihan dan kelestarian bumi.
                    </Typography>
                </div>
            </div>
            {/* Section input gambar */}
            <div className="w-full mt-[31px] mx-auto px-16 ">
                {/* Form handle gambar */}
                <form
                    className="flex flex-col items-center space-y-5"
                    onSubmit={handleSubmit}
                >
                    <Tabs
                        defaultValue="upload-file"
                        className="w-full flex flex-col items-center"
                    >
                        <TabsList>
                            <TabsTrigger value="upload-file">Unggah File Gambar</TabsTrigger>
                            <TabsTrigger value="camera">Scan Menggunakan Kamera</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload-file">
                            {isError && (
                                <Alert variant="destructive" className="mb-5">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        Ukuran file gambar anda melebihi batas maksimal 2MB
                                    </AlertDescription>
                                </Alert>
                            )}
                            {isNullImg && (
                                <Alert variant="destructive" className="mb-5">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        Tidak ada Gambar Yang Diupload
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div
                                className="relative border-2 border-dashed border-emerald-500 rounded-lg p-8 flex flex-col md:flex-row items-center justify-center gap-4 bg-[#EAF0E4] transition hover:bg-[rgb(221,230,212)] w-full md:w-[1312px] min-h-[412px]">
                                {imgPreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imgPreview}
                                            alt="Preview"
                                            className="max-w-32 md:max-w-40 rounded-lg"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-xl">
                                        <img src={UploadIcon} alt="Upload Icon"/>
                                    </div>
                                    <p className="text-center text-emerald-600 mt-4">
                                        Klik untuk <span className="font-semibold">upload</span>{" "}
                                        atau drag and drop
                                    </p>
                                    <p className="text-center text-sm text-emerald-600 mt-1">
                                        .jpg, .png MAX(100px x 100px)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="file"
                                        onChange={handleFileChange}
                                        className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="camera">
                            <div
                                className="relative border-2 border-dashed border-emerald-500 rounded-lg p-8 flex flex-col md:flex-row items-center justify-center gap-4 bg-[#EAF0E4] transition hover:bg-[rgb(221,230,212)] w-5xl w-full md:w-[1312px]">
                                <div className="h-full">
                                    {imgSrc ? (
                                        <img src={imgSrc} alt="webcam"/>
                                    ) : (
                                        <>
                                            <Webcam
                                                ref={webcamRef}
                                                className="h-full rounded-md"
                                                screenshotFormat="image/jpeg"
                                                screenshotQuality={0.8}
                                                videoConstraints={{
                                                    facingMode: "environment",
                                                }}
                                            />
                                            <div className="flex justify-center mt-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={capture}
                                                    type="button"
                                                >
                                                    Capture Photo
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button size="md" className="max-w-fit px-8 " type="submit">
                        Prediksi
                    </Button>
                </form>
            </div>
            {isLoading ? (
                <>
                    <Loading/>
                </>
            ) : (
                isPrediction &&
                predictionResult && (
                    <div
                        className="max-w-[1512px] flex flex-col gap-8 mx-auto px-8 md:px-12 lg:px-16 mt-10 md:mt-14 lg:mt-16">
                        {/* title prediksi */}
                        <div className="text-center">
                            <div>
                                <Typography variant="h1">
                                    <strong className="text-emerald-600">Hasil Prediksi</strong>{" "}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="p">
                                    Dari file yang anda unggah, berikut adalah hasil prediksi yang
                                    sistem kami lakukan
                                </Typography>
                            </div>
                        </div>
                        {/* Deskripsi hasil prediksi */}
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 bg-[#EAF0E4] border border-emerald-500 rounded-md p-4 md:p-6 lg:p-10 gap-4 md:gap-6 lg:gap-8">
                            {/* Gambar kiri */}
                            <div>
                                <img
                                    src={imagePreview}
                                    alt="sampah"
                                    className="w-full rounded-md"
                                />
                            </div>
                            {/* Penjelasan Deskripsi */}
                            <div className="flex flex-col gap-4">
                                <Typography
                                    variant="h4"
                                    className="w-full rounded-full bg-emerald-600 text-white text-center py-2 uppercase"
                                >
                                    {predictionResult.prediction}{" "}
                                    <span>{(predictionResult.confidence * 100).toFixed(2)}%</span>
                                </Typography>
                                <div className="flex flex-col gap-1 items-center md:items-start">
                                    <Typography
                                        variant="lead"
                                        className="font-bold text-emerald-600"
                                    >
                                        Kategori :
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="px-6 py-2 text-emerald-600 border border-emerald-600 rounded-full max-w-fit"
                                    >
                                        {getCategory(predictionResult.prediction)}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography
                                        variant="lead"
                                        className="font-bold text-emerald-600"
                                    >
                                        Saran Pengolahan :{" "}
                                    </Typography>
                                    <ul className="list-decimal pl-6 text-justify leading-loose">
                                        {CaraPengolahan[predictionResult.prediction]
                                            .slice(0, 2)
                                            .map((method, index) => (
                                                <li key={index} className="text-emerald-600">
                                                    {method}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                <div>
                                    {/* Modal Box */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            {/* trigger modal */}
                                            <Typography
                                                variant="p"
                                                className="text-right italic font-bold text-emerald-600 cursor-pointer"
                                            >
                                                {" "}
                                                Lihat lebih banyak...{" "}
                                            </Typography>
                                        </AlertDialogTrigger>
                                        {/* Deskripsi Modal */}
                                        <AlertDialogContent className="overflow-y-auto max-h-[90vh] p-4">
                                            {/* header modal */}
                                            <AlertDialogTitle
                                                className="text-emerald-600 flex justify-between items-center">
                                                <Typography
                                                    variant="h2"
                                                    className="text-emerald-600"
                                                >
                                                    Detail Informasi
                                                </Typography>
                                                <AlertDialogCancel
                                                    className="p-0 border-0 transition hover:bg-transparent">
                                                    <img src={CloseIcon} alt="" className=""/>
                                                </AlertDialogCancel>
                                            </AlertDialogTitle>
                                            {/* body modal */}
                                            <AlertDialogDescription
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                                                {/* gambar */}
                                                <div className="">
                                                    <img
                                                        src={imagePreview}
                                                        alt="sampah-kardus"
                                                        className="w-full rounded-md"
                                                    />
                                                </div>
                                                {/* deskripsi */}
                                                <div className="flex flex-col space-y-2">
                                                    <Typography
                                                        variant="h4"
                                                        className="w-full rounded-full bg-emerald-600 text-white text-center py-2 uppercase"
                                                    >
                                                        {predictionResult.prediction}{" "}
                                                    </Typography>
                                                    <div>
                                                        <table class="w-full text-sm text-left text-emerald-600">
                                                            <tbody className="py-4">
                                                            {dataTabel.map((row, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    label={row.label}
                                                                    value={row.value}
                                                                />
                                                            ))}
                                                            {/* Saran Pengolahan */}
                                                            <tr>
                                                                <td className="px-2 py-1">
                                                                    <Typography
                                                                        variant="p-regular"
                                                                        className="font-bold text-emerald-600"
                                                                    >
                                                                        Saran Pengolahan
                                                                    </Typography>
                                                                </td>
                                                                <td className="px-2 py-1">
                                                                    <Typography
                                                                        variant="p-regular"
                                                                        className="font-bold text-emerald-600"
                                                                    >
                                                                        :
                                                                    </Typography>
                                                                </td>
                                                                <td className="px-2 py-1"></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-2 py-1" colSpan={3}>
                                                                    <ul className="list-decimal pl-6 text-justify leading-loose">
                                                                        {CaraPengolahan[
                                                                            predictionResult.prediction
                                                                            ].map((method, index) => (
                                                                            <li
                                                                                key={index}
                                                                                className="text-emerald-600"
                                                                            >
                                                                                {method}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </td>
                                                            </tr>

                                                            {/* Rekomendasi Produk Kerajinan */}
                                                            <tr>
                                                                <td className="px-2 py-1" colSpan={2}>
                                                                    <Typography
                                                                        variant="p-regular"
                                                                        className="font-bold text-emerald-600"
                                                                    >
                                                                        Rekomendasi Produk
                                                                    </Typography>
                                                                </td>
                                                                <td className="px-2 py-1">
                                                                    <Typography
                                                                        variant="p-regular"
                                                                        className="font-bold text-emerald-600"
                                                                    >
                                                                        :
                                                                    </Typography>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-2 py-1" colSpan={3}>
                                                                    <div
                                                                        className="max-w-xl flex gap overflow-auto gap-4">
                                                                        {getCraftImagesByCategory(predictionResult.prediction).length > 0 ? (
                                                                            getCraftImagesByCategory(predictionResult.prediction).map((src, index) => (
                                                                                <img
                                                                                    key={index}
                                                                                    src={src}
                                                                                    alt={`Craft-${index}`}
                                                                                    className="rounded-md w-28 h-28"
                                                                                />
                                                                            ))
                                                                        ) : (
                                                                            <Typography variant="p"
                                                                                        className="text-emerald-600">
                                                                                Tidak ada produk yang direkomendasikan
                                                                            </Typography>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </AlertDialogDescription>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}

            {/* Section kategori sampah */}
            <div
                className="grid grid-cols-1 md:grid-cols-12 place-items-center mx-auto max-w-[1512px] px-8 md:px-12 lg:px-16 mt-10 md:mt-14 lg:mt-16">
                {/* Title section */}
                <div className="col-span-4 text-center md:text-left place-self-start flex flex-col gap-2">
                    <div>
                        <Typography variant="h1" className="hero-title">
                            <strong className="text-emerald-600">Kategori Sampah</strong> Yang
                            Tersedia
                        </Typography>
                    </div>
                    <div className="max-w-[300px] mx-auto md:mx-0">
                        <Typography variant="p" className="hero-description">
                            Jenis Sampah Yang Dapat Kami Deteksi Klasifikasi
                        </Typography>
                    </div>
                </div>
                {/* Container card sampah */}
                <div className="col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4 md:gap-y-8">
                    {CardSampah.map((item) => (
                        <figure
                            key={item.id}
                            ref={(el) => (classtificationRef.current[item.id] = el)}
                        >
                            <img
                                src={item.img}
                                alt={item.heading}
                                className="rounded-t-md w-full shadow-md"
                            />
                            <figcaption className="px-2 py-4">
                                <Typography variant="lead">
                                    <strong className="text-emerald-600">{item.heading} </strong>
                                </Typography>
                                <Typography variant="p">{item.subHeading}</Typography>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Prediction;
