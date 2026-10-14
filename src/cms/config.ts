import type { SiteContent } from "@/content/types";

/**
 * Cấu hình CMS: khai báo những gì trang quản trị cho phép sửa và cách hiển thị ô nhập.
 * Trang /admin/content/[key] tự sinh form từ đây; server tự sinh lược đồ Zod từ đây
 * (src/cms/schema.ts) để kiểm tra dữ liệu trước khi lưu.
 *
 * Thêm trường mới → dùng skill `cms-field` (cập nhật types.ts, defaults.ts, tệp này, component).
 */
export type Field =
  /** Chữ một dòng, có bản es + en */
  | { kind: "text"; name: string; label: string; max?: number; help?: string }
  /** Chữ nhiều dòng, có bản es + en. Xuống dòng (Enter) được giữ nguyên khi hiển thị nếu section hỗ trợ */
  | { kind: "textarea"; name: string; label: string; max?: number; help?: string }
  /** Danh sách đoạn văn es + en */
  | { kind: "textList"; name: string; label: string; min?: number; max?: number }
  /** Chuỗi không dịch: email, điện thoại, URL… */
  | {
      kind: "plain";
      name: string;
      label: string;
      format?: "email" | "phone" | "url" | "digits" | "text";
      optional?: boolean;
      help?: string;
    }
  /** Ảnh có mô tả thay thế (alt) es + en */
  | { kind: "image"; name: string; label: string; help?: string }
  /** Icon/ảnh trang trí: chỉ đường dẫn, không cần alt */
  | { kind: "icon"; name: string; label: string; help?: string }
  | { kind: "select"; name: string; label: string; options: { value: string; label: string }[] };

export type DocConfig = {
  key: keyof SiteContent;
  label: string;
  /** Mã section trong thiết kế (s02…), để nhóm và dẫn tới ảnh thiết kế */
  section: string;
  /** Neo trên trang công khai để bấm "Xem trên trang" */
  anchor?: string;
  description?: string;
} & (
  | { type: "object"; fields: Field[] }
  | {
      type: "list";
      fields: Field[];
      /** Trường dùng làm tiêu đề cho từng mục trong danh sách */
      itemTitle: string;
      min?: number;
      max?: number;
    }
);

const FIT = {
  kind: "select",
  name: "fit",
  label: "Cách hiển thị ảnh",
  options: [
    { value: "cover", label: "Lấp đầy khung (ảnh chụp)" },
    { value: "contain", label: "Giữ trọn ảnh (bao bì sản phẩm)" },
  ],
} as const satisfies Field;

const slideFields: Field[] = [
  { kind: "text", name: "title", label: "Tiêu đề", max: 80 },
  { kind: "textarea", name: "description", label: "Mô tả", max: 400 },
  { kind: "image", name: "image", label: "Ảnh" },
  FIT,
];

export const CMS_DOCS: DocConfig[] = [
  {
    key: "settings",
    section: "chung",
    label: "Thông tin chung & SEO",
    description: "Tên công ty, liên hệ ở footer, tiêu đề/mô tả khi chia sẻ và trên Google.",
    type: "object",
    fields: [
      { kind: "text", name: "companyName", label: "Tên công ty", max: 80 },
      {
        kind: "textarea",
        name: "address",
        label: "Địa chỉ",
        max: 200,
        help: "Mỗi dòng (Enter) là một dòng ở footer.",
      },
      { kind: "plain", name: "email", label: "Email liên hệ", format: "email" },
      { kind: "plain", name: "phone", label: "Điện thoại", format: "phone" },
      {
        kind: "plain",
        name: "whatsapp",
        label: "Số WhatsApp",
        format: "digits",
        optional: true,
        help: "Chỉ chữ số, gồm mã nước. Ví dụ 5350509999.",
      },
      {
        kind: "plain",
        name: "facebook",
        label: "Trang Facebook",
        format: "url",
        optional: true,
        help: "https://facebook.com/… — để trống nếu chưa có.",
      },
      { kind: "text", name: "seoTitle", label: "Tiêu đề SEO", max: 90 },
      { kind: "textarea", name: "seoDescription", label: "Mô tả SEO", max: 200 },
    ],
  },
  {
    key: "hero",
    section: "s02",
    anchor: "inicio",
    label: "Hero",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề lớn", max: 60 },
      { kind: "text", name: "subtitle", label: "Dòng phụ (chữ xanh)", max: 90 },
      { kind: "image", name: "background", label: "Ảnh nền" },
    ],
  },
  {
    key: "intro",
    section: "s03",
    anchor: "introduccion",
    label: "Giới thiệu",
    type: "object",
    fields: [
      { kind: "textarea", name: "heading", label: "Câu giới thiệu (cột trái)", max: 160 },
      { kind: "textList", name: "paragraphs", label: "Đoạn văn (cột phải)", min: 1, max: 4 },
      { kind: "text", name: "partnerTitle", label: "Tiêu đề khối “Un solo socio”", max: 80 },
      { kind: "textarea", name: "partnerText", label: "Nội dung khối “Un solo socio”", max: 240 },
    ],
  },
  {
    key: "audiences",
    section: "s03",
    anchor: "introduccion",
    label: "Giới thiệu — 3 nhóm đối tượng",
    type: "list",
    itemTitle: "label",
    min: 1,
    max: 3,
    fields: [
      { kind: "textarea", name: "label", label: "Nhãn (Enter để xuống dòng)", max: 60 },
      { kind: "image", name: "image", label: "Ảnh" },
      { kind: "icon", name: "icon", label: "Icon tròn" },
    ],
  },
  {
    key: "cycle",
    section: "s04",
    label: "Solución integral — chữ",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề", max: 40 },
      { kind: "text", name: "startLabel", label: "Nhãn “Inicio de ciclo”", max: 24 },
      { kind: "text", name: "centerTitle", label: "Tiêu đề giữa vòng", max: 40 },
      { kind: "textarea", name: "centerText", label: "Câu giữa vòng", max: 120 },
    ],
  },
  {
    key: "cycleSteps",
    section: "s04",
    label: "Solución integral — các bước",
    description: "Vòng tròn tự chia đều theo số bước (nên 10–14 bước).",
    type: "list",
    itemTitle: "label",
    min: 6,
    max: 16,
    fields: [
      { kind: "text", name: "label", label: "Tên bước", max: 40 },
      { kind: "icon", name: "icon", label: "Icon" },
    ],
  },
  {
    key: "philosophy",
    section: "s05",
    label: "Filosofía — chữ",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề", max: 50 },
      { kind: "textarea", name: "text", label: "Đoạn văn", max: 260 },
    ],
  },
  {
    key: "philosophySlides",
    section: "s05",
    label: "Filosofía — ảnh trượt",
    type: "list",
    itemTitle: "label",
    min: 1,
    max: 10,
    fields: [
      { kind: "text", name: "label", label: "Nhãn xanh", max: 30 },
      { kind: "image", name: "image", label: "Ảnh" },
    ],
  },
  {
    key: "serviceModel",
    section: "s06",
    label: "Modelo de servicio — chữ & băng rôn",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề", max: 40 },
      { kind: "image", name: "banner", label: "Ảnh băng rôn" },
    ],
  },
  {
    key: "services",
    section: "s06",
    label: "Modelo de servicio — 6 dịch vụ",
    type: "list",
    itemTitle: "label",
    min: 3,
    max: 6,
    fields: [
      { kind: "textarea", name: "label", label: "Tên dịch vụ", max: 40 },
      { kind: "icon", name: "icon", label: "Icon" },
    ],
  },
  {
    key: "productGroups",
    section: "s07",
    anchor: "productos",
    label: "Grupo de productos — chữ",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề", max: 60 },
      { kind: "text", name: "ctaLabel", label: "Chữ trên nút", max: 60 },
    ],
  },
  {
    key: "productSlides",
    section: "s07",
    anchor: "productos",
    label: "Grupo de productos — các nhóm",
    type: "list",
    itemTitle: "title",
    min: 1,
    max: 9,
    fields: slideFields,
  },
  {
    key: "seedsInputs",
    section: "s08",
    label: "Semillas e insumos — tiêu đề",
    type: "object",
    fields: [{ kind: "text", name: "title", label: "Tiêu đề", max: 40 }],
  },
  {
    key: "inputSlides",
    section: "s08",
    label: "Semillas e insumos — giải pháp",
    type: "list",
    itemTitle: "title",
    min: 1,
    max: 9,
    fields: slideFields,
  },
  {
    key: "machinery",
    section: "s09",
    label: "Mecanización — chữ",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề", max: 40 },
      { kind: "text", name: "ctaLabel", label: "Chữ trên nút", max: 60 },
    ],
  },
  {
    key: "machines",
    section: "s09",
    label: "Mecanización — thẻ máy",
    type: "list",
    itemTitle: "title",
    min: 1,
    max: 12,
    fields: slideFields,
  },
  {
    key: "postHarvest",
    section: "s10",
    label: "Poscosecha — tiêu đề",
    type: "object",
    fields: [{ kind: "textarea", name: "title", label: "Tiêu đề", max: 100 }],
  },
  {
    key: "postHarvestSteps",
    section: "s10",
    label: "Poscosecha — 8 bước",
    description:
      "Đúng 8 bước (2 hàng × 4). Icon: ảnh nền trắng 336 × 328, vật thể sát đáy và căn giữa.",
    type: "list",
    itemTitle: "label",
    min: 8,
    max: 8,
    fields: [
      { kind: "textarea", name: "label", label: "Tên bước (Enter để xuống dòng)", max: 40 },
      { kind: "image", name: "image", label: "Hình minh họa" },
    ],
  },
  {
    key: "dryingSolutions",
    section: "s10",
    label: "Poscosecha — giải pháp (tab)",
    type: "list",
    itemTitle: "label",
    min: 1,
    max: 6,
    fields: [
      { kind: "text", name: "label", label: "Tên tab", max: 40 },
      { kind: "textarea", name: "description", label: "Mô tả", max: 300 },
      { kind: "image", name: "image", label: "Ảnh" },
      FIT,
    ],
  },
  {
    key: "digital",
    section: "s11",
    label: "Digital — chữ & ảnh",
    type: "object",
    fields: [
      { kind: "textarea", name: "title", label: "Tiêu đề", max: 100 },
      { kind: "text", name: "subtitle", label: "Tiêu đề nhóm", max: 60 },
      { kind: "textarea", name: "text", label: "Đoạn giới thiệu", max: 240 },
      { kind: "image", name: "image", label: "Ảnh bên phải" },
    ],
  },
  {
    key: "digitalFeatures",
    section: "s11",
    label: "Digital — 4 thẻ tính năng",
    type: "list",
    itemTitle: "title",
    min: 2,
    max: 4,
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề thẻ", max: 50 },
      { kind: "textarea", name: "description", label: "Mô tả", max: 260 },
      { kind: "icon", name: "icon", label: "Huy hiệu icon" },
    ],
  },
  {
    key: "benefits",
    section: "s12",
    anchor: "contacto",
    label: "Beneficio y contacto — tiêu đề",
    type: "object",
    fields: [{ kind: "text", name: "title", label: "Tiêu đề", max: 40 }],
  },
  {
    key: "benefitItems",
    section: "s12",
    anchor: "contacto",
    label: "Beneficio — các mục lợi ích",
    type: "list",
    itemTitle: "title",
    min: 1,
    max: 6,
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề mục", max: 50 },
      { kind: "textarea", name: "description", label: "Nội dung", max: 260 },
    ],
  },
  {
    key: "contact",
    section: "s12",
    anchor: "contacto",
    label: "Form liên hệ — chữ",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề form", max: 50 },
      { kind: "textarea", name: "intro", label: "Câu giới thiệu", max: 160 },
    ],
  },
  {
    key: "invitation",
    section: "s13",
    label: "Invitación a colaborar",
    type: "object",
    fields: [
      { kind: "text", name: "title", label: "Tiêu đề", max: 40 },
      { kind: "textarea", name: "text", label: "Đoạn văn", max: 240 },
      { kind: "text", name: "ctaLabel", label: "Chữ trên nút", max: 30 },
    ],
  },
  {
    key: "footerLinks",
    section: "s14",
    label: "Footer — liên kết",
    type: "list",
    itemTitle: "label",
    min: 0,
    max: 10,
    fields: [
      { kind: "text", name: "label", label: "Chữ hiển thị", max: 40 },
      {
        kind: "plain",
        name: "href",
        label: "Đường dẫn",
        format: "url",
        optional: true,
        help: "https://… hoặc /es/tiendas. Để trống = chữ thường, không phải liên kết.",
      },
    ],
  },
  {
    key: "stores",
    section: "tiendas",
    label: "Nuestras tiendas — cửa hàng",
    type: "list",
    itemTitle: "name",
    min: 0,
    max: 30,
    fields: [
      { kind: "text", name: "name", label: "Tên cửa hàng", max: 80 },
      { kind: "textarea", name: "address", label: "Địa chỉ", max: 200 },
      { kind: "plain", name: "phone", label: "Điện thoại", format: "phone" },
      { kind: "text", name: "hours", label: "Giờ mở cửa", max: 80 },
      {
        kind: "plain",
        name: "mapUrl",
        label: "Liên kết bản đồ",
        format: "url",
        optional: true,
      },
    ],
  },
];

export function getDocConfig(key: string): DocConfig | undefined {
  return CMS_DOCS.find((d) => d.key === key);
}
