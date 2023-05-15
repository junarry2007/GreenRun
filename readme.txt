Add files:

\src\common\account_config.json
\src\common\utils\enviroment.ts

--

Compile command: 

"npm run startLocal"

--





- TS (Hapi/NestJS) => hapijs[TS] => OK
- Use Knex/TypeORM => TypeORM => OK
- MySQL => OK (RDS en AWS)
- UserRoles Access => OK
- Firebase Auth => OK
- JWT Sessions => OK (pero de otra forma con consulta en Firebase :P)
- Deploy AWS/GCP => NO
- Implement Swagger Docs => OK
- Complete documentation => NO
- User GitHub/GitLab => GitHub => OK
- Create CI/CD pipelines => NO
- Clean code => OK



OK => Montar servicio de autenticacion de firebase en postman

Logica de negocio:

- Roles definidos 
    OK => Administrador
    OK => Usuario

- Endpoint Usuarios: 
    OK => Hacer una apuesta en un evento especifico
    OK => Depositar dinero en su cuenta (crear la transacción correspondiente)
    OK => Retirar dinero (crear la transacción correspondiente)
    NO => Actualizar datos de usuario
    OK => Solicitar su saldo (calcular saldo en base a transacciones)
    OK => Obtener sus transacciones

- Endpoint Administrador: 
    OK => Enumere todas las apuestas (se pueden filtrar por evento o deporte específico) (tabla de apuestas)
    NO => Enumere todas las transacciones del usuario (también se puede filtrar por usuario específico y/o categoría)
    NO => Solicitar saldo de usuario
    OK => Cambiar el estado de una apuesta (activa/cancelada)
    NO => Bloquear a un usuario específico (estado de usuario => activo/bloqueado) (no se pueden bloquear otros administradores)
    NO => Resultados de apuestas resueltas (ganadas/perdidas) 
        NO => Esta liquidación debería generar pagos para los usuarios que hayan realizado una apuesta por el opción ganadora en caso de ganar
        NO => Actualizar datos de usuario

- Comportamiento
    OK => Todas las apuestas realizadas o retiros deben verificar si el usuario tiene suficiente cantidad para realizar esa acción
    OK => Se debe permitir realizar más de una apuesta al mismo tiempo
    NO => Los administradores no pueden bloquear a otros administradores
    NO => Los administradores pueden actualizar los datos de los usuarios (no de otros administradores)
    NO => Las apuestas deben tener un estado diferente (activas/canceladas/establecidas) teniendo en cuenta los siguientes requisitros
        OK => Los usuarios no pueden realizar apuestas en apuestas canceladas o resueltas
        OK => Las apuestas ya liquidadas no se pueden cancelar
        OK => Las apuestas canceladas se pueden volver a activar
    NO => El saldo del usuario debe calcularse en función de las transacciones del usuario.
    NO => Los administradores pueden liquidar los resultados de las apuestas para un event_id específico y cada una de sus opciones de
       apuesta (ganadas/perdidas) y luego el punto final debe activar los pagos para todas las transacciones de apuestas en la
       opción ganadora y también actualizar el estado de la tabla user_bets. Nuevamente, para las transacciones ganadoras, el 
       monto se calcula en función de la cuota de la apuesta.
        NO => cantidad de usuario_apuesta