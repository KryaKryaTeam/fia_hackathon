'use client'
import { observer } from "mobx-react-lite";
import container, { TYPES } from "@/infrastructure/Container";
import { Button } from "../ui/button";
import GetGeoDataLocalRequest from "@/request/GetGeoDataLocal.request";
import ModalState from "@/state/Modal.state";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

const modalState = container.get<ModalState>(TYPES.ModalState);

function GeolocationAccessModal() {
  const router = useRouter();

  if (!modalState.isActive("Geo")) return null;

  async function handle() {
    const request = container.get<GetGeoDataLocalRequest>(TYPES.GetGeoData);

    try {
      await request.execute();
      modalState.unactive("Geo");
    } catch (error) {
      console.error(error);
      modalState.unactive("Geo");
    }
  }

  function handleDecline() {
    modalState.unactive("Geo");
  }

  return (
    <div className="flex flex-col items-center gap-4 max-w-sm mx-auto p-6 rounded-2xl border bg-card text-center shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
        <MapPin className="w-6 h-6" />
      </div>

      <h1 className="text-lg font-semibold text-foreground">
        Для спрощення роботи нам потрібна ваша геолокація
      </h1>

      <p className="text-sm text-muted-foreground">
        Це допоможе автоматично визначити, звідки надходить скарга. Якщо ви не бажаєте
        вмикати геолокацію, будь ласка, вказуйте вулицю та номер будинку в заявах вручну.
      </p>

      <div className="flex w-full gap-3 mt-2">
        <Button variant="outline" className="flex-1" onClick={handleDecline}>
          Відмовитися
        </Button>
        <Button className="flex-1" onClick={handle}>
          Погодитися
        </Button>
      </div>
    </div>
  );
}

export default observer(GeolocationAccessModal);