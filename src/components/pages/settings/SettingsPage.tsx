import {yupResolver} from '@hookform/resolvers/yup';
import {Skeleton, TextField} from '@mui/material'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ErrorMessage} from 'components/ui/text/ErrorMessage';
import {FC, useContext, useEffect, useMemo, useState} from 'react'
import {useForm} from 'react-hook-form';
import {yupLocale} from 'utils/yupLocale';
import * as yup from 'yup'
import {CompanyService} from "../../../services/company/company.service";
import {useTranslation} from "react-i18next";
import {ICompanySettings} from 'interfaces/company.interface';
import {LoadingButton} from "@mui/lab";
import ElementSkeleton from "../../ui/skeleton/ElementSkeleton";
import {SnackbarContext} from "../../../providers/Snackbar.provider";
import {ErrorCodes} from "../../../enums/ErrorCodes";
import {IStandardError} from "../../../interfaces/responseError.interface";
import _ from 'underscore';

yup.setLocale(yupLocale);

const schema = yup.object().shape({
    cooksNumber: yup.number()
        .integer()
        .transform((value) => (isNaN(value) ? null : value))
        .nullable()
        .min(1)
        .max(1000),
});

const getCompanySettingsKey = 'getCompanySettings'

const SettingsPage: FC = () => {
    const {t} = useTranslation(["companySettings", "common\\form", "common\\errors"]);
    const queryClient = useQueryClient();
    const { setSnack } = useContext(SnackbarContext);

    const [startValues, setStartValues] = useState<ICompanySettings>()

    const getCompanySettingsQuery = useQuery<ICompanySettings>([getCompanySettingsKey], () => {
        return CompanyService.getCompanySettings();
    });
    const updateCompanySettingsMutation = useMutation(['updateCompanySettings'], (companySettings: ICompanySettings) => {
        return CompanyService.updateCompanySettings(companySettings);
    },{
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [getCompanySettingsKey] });
            setSnack({ message: t("saveSuccess"), color: 'success', open: true, autoHideDuration: 6_000 });
        },
        onError: error => {
            setSnack({ message: t(`common\\errors:${ErrorCodes[(error as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 20_000 });
        }
    });
    useEffect(() => {
        setStartValues(getCompanySettingsQuery.data)
    }, [getCompanySettingsQuery.data]);

    const {register, formState: {errors}, handleSubmit} = useForm<ICompanySettings>({
        resolver: yupResolver(schema),
        mode: 'onTouched',
        values: getCompanySettingsQuery.data
    });
    const onSubmit = async (data: ICompanySettings) => {
        if (_.isEqual(startValues, data)) {
            setSnack({ message: t("noDataChange"), color: 'info', open: true, autoHideDuration: 6_000 });
            return;
        }
        updateCompanySettingsMutation.mutate(data);
    }

    return (
        <div className="max-w-sm w-full justify-self-start mx-12">
            <div className="flex flex-col justify-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <ElementSkeleton isLoading={getCompanySettingsQuery.isLoading}>
                            <TextField {...register('cooksNumber')}
                                       fullWidth
                                       error={!!errors.cooksNumber}
                                       helperText={
                                           <ErrorMessage
                                               error={errors.cooksNumber?.message}
                                               field={t('preparation.fields.cooksNumber.label') as string}
                                           />
                                       }
                                       label={t('preparation.fields.cooksNumber.label')}
                                       type='number'
                            />
                        </ElementSkeleton>

                    </div>
                    <div className="text-right mt-3">
                        <ElementSkeleton isLoading={getCompanySettingsQuery.isLoading}>
                            <LoadingButton type="submit"
                                           variant={"contained"}
                                           disabled={updateCompanySettingsMutation.isLoading}
                                           loading={updateCompanySettingsMutation.isLoading}
                                           size={"medium"}
                            >
                                <span>{t("common\\form:buttons.save")}</span>
                            </LoadingButton>
                        </ElementSkeleton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SettingsPage