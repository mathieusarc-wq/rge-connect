import { redirect } from "next/navigation";

// Les CGU génériques n'existent pas — on redirige vers les CGV spécifiques.
// Le form register pointe vers /cgv-sous-traitant ou /cgv-installateur selon le role.
export default function CguPage() {
  redirect("/cgv-sous-traitant");
}
