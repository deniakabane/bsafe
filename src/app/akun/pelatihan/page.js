import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  return (
    <div className="ml-64 p-8 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Form Profil */}
        <Card className="p-8 bg-white shadow-lg rounded-lg mb-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Pelatihan</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField label="Nama" placeholder="Your First Name" />
              <InputField label="Phone" placeholder="089512345678" />
              <InputField label="Golongan Darah" placeholder="AB +" />
              <InputField label="Agama" placeholder="Kongguan" />
              <InputField label="Kota" placeholder="Bogor" />
              <InputField label="Alamat Lengkap" placeholder="Bogor" />
              <InputField label="Gelar" placeholder="S1" />
              <InputField label="Diploma Number" placeholder="123455" />
            </div>

            <div className="space-y-4">
              <InputField label="Email" placeholder="nanda@gmail.com" />
              <InputField label="Jenis Kelamin" placeholder="Laki Laki" />
              <InputField label="Tanggal Lahir" placeholder="4 Juni 2004" />
              <InputField label="Provinsi" placeholder="Jawa Barat" />
              <InputField label="Pendidikan Terakhir" placeholder="Your Last Education" />
              <InputField label="Wilayah" placeholder="JABODETABEK" />
              <InputField label="Universitas" placeholder="Univ Englekan" />
              <InputField label="Referensi" placeholder="Website" />
            </div>
          </div>
        </Card>

        {/* Tempat Dokumen */}
        <Card className="p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Tempat Dokumen</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField label="Nama" placeholder="Your First Name" />
              <InputField label="Phone" placeholder="089512345678" />
              <InputField label="Golongan Darah" placeholder="AB +" />
            </div>

            <div className="space-y-4">
              <InputField label="Email" placeholder="nanda@gmail.com" />
              <InputField label="Jenis Kelamin" placeholder="Laki Laki" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Komponen Reusable untuk Input Field
const InputField = ({ label, placeholder }) => (
  <div>
    <label className="block text-gray-900 font-medium mb-1">{label}</label>
    <Input className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} />
  </div>
);
