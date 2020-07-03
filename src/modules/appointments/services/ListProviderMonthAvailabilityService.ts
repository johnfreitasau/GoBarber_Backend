// import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
// import '@modules/appointments/infra/http/routes/appointments.routes';
// import AppError from '@shared/errors/AppError';
// import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
// import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      {
        length: numberOfDaysInMonth,
      },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );
      console.log('<<<AppointmentInDay');
      console.log(appointmentInDay);
      console.log('>>>');

      // return {
      //   day,
      //   available: appointmentInDay.length < 10,
      // };
      return {
        day,
        available: appointmentInDay.length < 7,
      };
    });

    // const allAppointments = this.appointmentsRepository.listAllAppointmentsTest();
    // console.log('TEST: LIST ALL APPOINTMENTS:');
    // console.log(allAppointments);
    // console.log('TEST END');

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
