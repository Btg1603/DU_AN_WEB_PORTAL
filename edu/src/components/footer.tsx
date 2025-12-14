import React from "react";
import { MapPin, Phone } from "lucide-react";

export default function ContactFooter() {
  const contacts = [
    {
      title: "Cơ sở 1",
      address: "HPC Landmark - 105 Tố Hữu, Hà Đông, Hà Nội",
      phone: "0862 069 233",
    },
    {
      title: "Cơ sở 3",
      address:
        "Tầng 12, Tòa nhà Đầm Bảo An Toàn Hàng Hải phía Nam, Số 42 đường Từ Cường, phường 4, Tân Bình, TP HCM",
      phone: "0862 069 233",
    },
    {
      title: "Cơ sở 5",
      address:
        "Tầng 3, tòa TSA Bulding, Số 77 Lê Trung Nghĩa, Phường 12, Tân Bình, Thành phố Hồ Chí Minh",
      phone: "0962 703 893",
    },
    {
      title: "Cơ sở PTIT Hà Nội",
      address:
        "Học viện Công nghệ Bưu chính viễn thông, Km10, đường Nguyễn Trãi, Hà Đông, Hà Nội",
      phone: "0862 069 233",
    },
    {
      title: "Cơ sở 2",
      address: "HPC Landmark - 105 Tố Hữu, Hà Đông, Hà Nội",
      phone: "0862 069 233",
    },
    {
      title: "Cơ sở 4",
      address:
        "Tầng 4, Tòa Ricco, số 363 Nguyễn Hữu Thọ, phường Khuê Trung, quận Cẩm Lệ, Đà Nẵng",
      phone: "0904 694 869",
    },
    {
      title: "Cơ sở Fukuoka",
      address:
        "Tokan Fukuoka 2nd Building 417 Hiecho 1-chome-18, Hakata-ku, Fukuoka, Japan",
      phone: "0904 694 869",
    },
    {
      title: "Cơ sở PTIT Hồ Chí Minh",
      address:
        "Học viện Công nghệ Bưu chính viễn thông, 97 Man Thiện, Phường Hiệp Phú, Thủ Đức, TP HCM",
      phone: "0962 703 893",
    },
  ];

  return (
    <div className="bg-[#fafafa] py-16 px-12">
      <div className="w-full">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Liên hệ</h2>
        <div className="border-t border-gray-200 mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contacts.map((contact, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="text-blue-600 font-semibold text-lg mb-6">
                {contact.title}
              </h3>

              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-sm leading-relaxed">
                  {contact.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="text-gray-700 text-sm hover:text-blue-600 transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
