import {
  Button,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "src/store";
import { Account } from "src/types/user-data/account";
import { useState } from "react";
import { SettingsCard } from "src/components/account/settings-card";
import { AccountList } from "./account-list";
import { ModalMyInfo } from "../../../../common/modal/modal-my-info";
import { AddAccountForm } from "./add-account-form";
import { DeleteAccountModal } from "./delete-account-modal";
import { errorNotification } from "src/slices/my-account-notificacion-slice";
import { Typography } from "@mui/material";

export const MyAccounts = () => {
  const { user } = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [accountToDelete, setAccountToDelete] = useState<string>("");

  const handleDeleteAccount = (id: string): void => {
    setAccountToDelete(id);
    setOpenDeleteAccountModal(true);
  };
  const deleteAccount = () => {
    const newAccounts = myAccounts.filter(
      (account) => account.id !== accountToDelete
    );
    setMyAccounts(newAccounts);
    setAccountToDelete("");
    dispatch(
      errorNotification({
        msg: "Eliminaste tu cuenta bancaria",
        tab: "my-accounts",
      })
    );
    closeDeleteModal();
  };
  const accounts: Account[] = [
    {
      id: "0",
      name: "Santander Pesos",
      cbu: "ISLA.DEL.SOL",
      coin: "ARS",
      user: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: "2",
      name: "Galicia Pesos",
      cbu: "SOL.NUBE.LLUVIA",
      coin: "USD",
      user: null,
      createdAt: null,
      updatedAt: null,
    },
  ]; // user?.accounts;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] =
    useState<boolean>(false);
  const closeModal = () => {
    setOpenModal(false);
  };
  const closeDeleteModal = () => {
    setOpenDeleteAccountModal(false);
  };
  const [myAccounts, setMyAccounts] = useState<Account[]>(accounts);
  const openAddAccount = () => {
    setOpenModal(true);
  };
  return (
    <>
      <Grid
        item
        md={12}
        xs={12}
      >
        <SettingsCard
          action={
            <Button
              onClick={openAddAccount}
              size="small"
              variant="contained"
            >
              Agregar cuenta
            </Button>
          }
          description="Cuentas desde las que vas a ingresar y retirar dinero."
          title="Cuentas bancarias"
        >
          {myAccounts.length > 0 ? (
            <AccountList
              myAccounts={myAccounts}
              handleDeleteAccount={handleDeleteAccount}
            />
          ) : (
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Aún no tenés una cuenta bancaria asociada. Agregá una para
              empezar a invertir.
            </Typography>
          )}
        </SettingsCard>
      </Grid>
      <ModalMyInfo open={openModal} handleClose={closeModal}>
        <AddAccountForm closeModal={closeModal} />
      </ModalMyInfo>
      <ModalMyInfo open={openDeleteAccountModal} handleClose={closeDeleteModal}>
        <DeleteAccountModal
          handleCloseModal={closeDeleteModal}
          deleteAccount={deleteAccount}
        />
      </ModalMyInfo>
    </>
  );
};
