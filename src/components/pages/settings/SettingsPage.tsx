import {yupResolver} from '@hookform/resolvers/yup';
import {Skeleton, TextField, Tooltip} from '@mui/material'
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

yup.setLocale(yupLocale);

const schema = yup.object().shape({
    cooksNumber: yup.number()
        .integer()
        .transform((value) => (isNaN(value) ? null : value))
        .nullable()
        .min(1)
        .max(1000),
    maxSimultaneousOrders: yup.number()
        .integer()
        .transform((value) => (isNaN(value) ? null : value))
        .nullable()
        .min(1)
        .max(10000),
});

const getCompanySettingsKey = 'getCompanySettings'

const SettingsPage: FC = () => {
    const {t} = useTranslation(["companySettings", "common\\form", "common\\errors"]);
    const queryClient = useQueryClient();
    const {setSnack} = useContext(SnackbarContext);

    const [startValues, setStartValues] = useState<ICompanySettings>()

    const getCompanySettingsQuery = useQuery<ICompanySettings>([getCompanySettingsKey], () => {
        return CompanyService.getCompanySettings();
    });
    const updateCompanySettingsMutation = useMutation(['updateCompanySettings'], (companySettings: ICompanySettings) => {
        return CompanyService.updateCompanySettings(companySettings);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [getCompanySettingsKey]});
            setSnack({message: t("saveSuccess"), color: 'success', open: true, autoHideDuration: 6_000});
        },
        onError: error => {
            setSnack({
                message: t(`common\\errors:${ErrorCodes[(error as IStandardError)?.errorCode]}`),
                color: 'error',
                open: true,
                autoHideDuration: 20_000
            });
        }
    });
    useEffect(() => {
        setStartValues(getCompanySettingsQuery.data)
    }, [getCompanySettingsQuery.data]);

    const {register, formState: {errors}, handleSubmit} = useForm<ICompanySettings>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        values: getCompanySettingsQuery.data
    });
    const onSubmit = async (data: ICompanySettings) => {
        if (_.isEqual(startValues, data)) {
            setSnack({message: t("noDataChange"), color: 'info', open: true, autoHideDuration: 6_000});
            return;
        }
        updateCompanySettingsMutation.mutate(data);
    }

    return (
        <div className="max-w-4xl w-full justify-self-start mx-auto">
            <div className="flex flex-col justify-start max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <ElementSkeleton isLoading={getCompanySettingsQuery.isLoading}>
                            <div className="flex flex-row">
                                <TextField {...register('cooksNumber')}
                                           fullWidth
                                           placeholder={t("emptyPlaceholder") as string}
                                           error={!!errors.cooksNumber}
                                           InputLabelProps={{ shrink: true }}
                                           helperText={
                                               <ErrorMessage
                                                   error={errors.cooksNumber?.message}
                                                   field={t('preparation.fields.cooksNumber.label') as string}
                                               />
                                           }
                                           label={t('preparation.fields.cooksNumber.label')}
                                           type='number'
                                />
                                <Tooltip className="" title={t('preparation.fields.cooksNumber.description')}
                                         enterTouchDelay={1} enterNextDelay={1} enterDelay={1}
                                         placement="right-start">
                                    <HelpOutlineIcon className="w-7 h-7 p-1"/>
                                </Tooltip>
                            </div>
                        </ElementSkeleton>
                        <ElementSkeleton isLoading={getCompanySettingsQuery.isLoading}>
                            <div className="flex flex-row">
                                <TextField {...register('maxSimultaneousOrders')}
                                           placeholder={t("emptyPlaceholder") as string}
                                           fullWidth
                                           error={!!errors.maxSimultaneousOrders}
                                           InputLabelProps={{ shrink: true }}
                                           helperText={
                                               <ErrorMessage
                                                   error={errors.maxSimultaneousOrders?.message}
                                                   field={t('preparation.fields.maxSimultaneousOrders.label') as string}
                                               />
                                           }
                                           label={t('preparation.fields.maxSimultaneousOrders.label')}
                                           type='number'
                                />
                                <Tooltip className="" title={t('preparation.fields.maxSimultaneousOrders.description')}
                                         enterTouchDelay={1} enterNextDelay={1} enterDelay={1}
                                         placement="right-start">
                                    <HelpOutlineIcon className="w-7 h-7 p-1"/>
                                </Tooltip>
                            </div>
                        </ElementSkeleton>

                    </div>
                    <div className="text-right mt-3 mr-8">
                        <ElementSkeleton isLoading={getCompanySettingsQuery.isLoading}>
                            <LoadingButton className="px-8" type="submit"
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