"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOperators } from "@/lib/hooks/useOperators";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/api/client";

/**
 * Schéma de validation pour le formulaire de modification de mot de passe d'opérateur
 * Règles :
 * - Minimum 8 caractères
 * - Au moins une majuscule
 * - Au moins une minuscule
 * - Au moins un chiffre
 * - Les deux champs doivent correspondre
 */
const editPasswordSchema = z.object({
  password: z
    .object({
      first: z
        .string()
        .min(1, "Le mot de passe est requis")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
      second: z.string().min(1, "La confirmation du mot de passe est requise"),
    })
    .refine((data) => data.first === data.second, {
      message: "Les mots de passe ne correspondent pas",
      path: ["second"],
    }),
});

type EditPasswordFormData = z.infer<typeof editPasswordSchema>;

interface EditOperatorPasswordFormProps {
  operatorId: string | number;
}

export default function EditOperatorPasswordForm({
  operatorId,
}: EditOperatorPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<EditPasswordFormData>({
    resolver: zodResolver(editPasswordSchema),
    defaultValues: {
      password: {
        first: "",
        second: "",
      },
    },
  });

  const {
    updatePassword,
    isUpdatingPassword,
    updatePasswordError,
  } = useOperators();

  // Surveiller les valeurs pour la validation en temps réel
  const passwordFirst = watch("password.first");
  const passwordSecond = watch("password.second");

  /**
   * Gestion de la soumission du formulaire
   */
  const onSubmit = async (data: EditPasswordFormData) => {
    try {
      await updatePassword(operatorId, {
        first: data.password.first,
        second: data.password.second,
      });
      setIsSuccess(true);

      // Rediriger vers la page de détails de l'opérateur après 2 secondes
      setTimeout(() => {
        router.push(`/gestionnaire/${operatorId}`);
      }, 2000);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError("root", {
        type: "manual",
        message:
          updatePasswordError ||
          errorMessage ||
          "Une erreur s'est produite. Veuillez réessayer.",
      });
    }
  };

  // Afficher le message d'erreur du hook operators ou de la validation du formulaire
  const displayError = updatePasswordError || errors.root?.message;
  const isLoading = isSubmitting || isUpdatingPassword;

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="w-full max-w-2xl mx-auto mb-5">
        <Link
          href={`/gestionnaire/${operatorId}`}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Retour aux détails du gestionnaire
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-2xl mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Modification du mot de passe
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Définissez un nouveau mot de passe pour ce compte gestionnaire
            </p>
          </div>
          <div>
            {/* Message de succès */}
            {isSuccess && (
              <div className="mb-6">
                <Alert
                  variant="success"
                  title="Mot de passe modifié"
                  message="Le mot de passe a été modifié avec succès. Redirection en cours..."
                />
              </div>
            )}

            {/* Alerte d'erreur */}
            {displayError && !isSuccess && (
              <div className="mb-6">
                <Alert
                  variant="error"
                  title="Erreur"
                  message={displayError}
                />
              </div>
            )}

            {/* Rappel des règles */}
            {!isSuccess && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Rappel :</strong> Le mot de passe doit être composé
                  d&apos;au moins 8 caractères et contenir au moins une majuscule,
                  une minuscule et un chiffre.
                </p>
              </div>
            )}

            {!isSuccess && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  {/* Champ Nouveau mot de passe */}
                  <div>
                    <Label htmlFor="password.first">
                      Nouveau mot de passe{" "}
                      <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password.first"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez le nouveau mot de passe"
                        {...register("password.first")}
                        error={!!errors.password?.first}
                        hint={errors.password?.first?.message}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Champ Confirmation mot de passe */}
                  <div>
                    <Label htmlFor="password.second">
                      Confirmation du mot de passe{" "}
                      <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password.second"
                        type={showPasswordConfirm ? "text" : "password"}
                        placeholder="Confirmez le nouveau mot de passe"
                        {...register("password.second")}
                        error={!!errors.password?.second}
                        hint={errors.password?.second?.message}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordConfirm(!showPasswordConfirm)
                        }
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        aria-label={
                          showPasswordConfirm
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showPasswordConfirm ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </button>
                    </div>
                    {/* Afficher une indication si les mots de passe ne correspondent pas */}
                    {passwordFirst &&
                      passwordSecond &&
                      passwordFirst !== passwordSecond && (
                        <p className="mt-1.5 text-xs text-error-500">
                          Les mots de passe ne correspondent pas
                        </p>
                      )}
                  </div>

                  {/* Bouton de soumission */}
                  <div>
                    <Button
                      className="w-full sm:w-auto"
                      size="sm"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Modification en cours..." : "Modifier"}
                    </Button>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-error-500">*</span> champs obligatoires
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

