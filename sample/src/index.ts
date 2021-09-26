import { interval, Observable, timer } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { UserDTO, UserService } from './user.service';

interface UserEntity {
    id: string;
    firstName: string;
    lastName: string;
}

const UserEntityMod = {
    fromDTO(userDTO: UserDTO): UserEntity {
        return {
            id: userDTO.id,
            firstName: userDTO.first_name,
            lastName: userDTO.last_name,
        };
    },

    toDTO(user: UserEntity): UserDTO {
        return {
            id: user.id,
            first_name: user.firstName,
            last_name: user.lastName,
        };
    },

    fromDTOPartial(userDTOPart: Partial<UserDTO>): Partial<UserEntity> {
        return {
            id: userDTOPart.id,
            firstName: userDTOPart.first_name,
            lastName: userDTOPart.last_name,
        }; 
    },

    toDTOPartial(userPart: Partial<UserEntity>): Partial<UserDTO> {
        return {
            id: userPart.id,
            first_name: userPart.firstName,
            last_name: userPart.lastName,
        };
    },
};

type Dictionary<T> = {[id: string | number | symbol]: T};

const userStore: Dictionary<UserEntity> = {};

const userService = new UserService();

function fetchUser(id: string, invalidate?: boolean) {
    return userService.fetchUser(id, invalidate).pipe(
        tap(result => {
            if (result.type == 'fetched') {
                userStore[id] = UserEntityMod.fromDTO(result.userDTO);
            }
        }),
        map(() => 
            userStore[id],
        ),
    );
}

function updateUser(user: UserEntity) {
    return userService.updateUser(UserEntityMod.toDTO(user)).pipe(
        tap(userDTO => {
            userStore[user.id] = UserEntityMod.fromDTO(userDTO);
        }),
    );
}

function deleteUser(id: string) {
    return userService.deleteUser(id).pipe(
        tap(() => {
            delete userStore[id];
        })
    );
}

function patchUser(id: string, userPart: Partial<UserEntity>) {
    return userService.patchUser(id, {
        ...UserEntityMod.toDTOPartial(userPart),
        id,
    }).pipe(
        tap((userDTO) => userStore[id] = UserEntityMod.fromDTO(userDTO)),
    );
}

function createUser(user: UserEntity) {
    return userService.createUser(UserEntityMod.toDTO(user)).pipe(
        tap(userDTO => userStore[userDTO.id] = UserEntityMod.fromDTO(userDTO)),
        map(userDTO => UserEntityMod.fromDTO(userDTO))
    );
}

function firstValueFrom<T>(obs: Observable<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        obs.pipe(take(1)).subscribe({
            next(obj: T) { resolve(obj)},
            error(err: any) { reject(err)},
        });
    });
}

async function main() {
    let intervalSup = interval(500).subscribe(() => process.stdout.write('.'));
    let user = await firstValueFrom(fetchUser('2'));
    intervalSup.unsubscribe();
    process.stdout.write('\n');
    console.log(`got user: id: ${user.id}, first name: ${user.firstName}, last name: ${user.lastName}`);

    intervalSup = interval(5000).subscribe(() => process.stdout.write('.'));
    user = await firstValueFrom(fetchUser('2'));
    intervalSup.unsubscribe();
    process.stdout.write('\n');
    console.log(`got user: id: ${user.id}, first name: ${user.firstName}, last name: ${user.lastName}`);
    
    await firstValueFrom(timer(5000));

    console.log('\nfetching user after 5 seconds');

    intervalSup = interval(500).subscribe(() => process.stdout.write('.'));
    user = await firstValueFrom(fetchUser('2'));
    intervalSup.unsubscribe();
    process.stdout.write('\n');
    console.log(`got user: id: ${user.id}, first name: ${user.firstName}, last name: ${user.lastName}`);

    intervalSup = interval(500).subscribe(() => process.stdout.write('.'));
    user = await firstValueFrom(fetchUser('2'));
    intervalSup.unsubscribe();
    process.stdout.write('\n');
    console.log(`got user: id: ${user.id}, first name: ${user.firstName}, last name: ${user.lastName}`);


    intervalSup = interval(500).subscribe(() => process.stdout.write('.'));
    user = await firstValueFrom(fetchUser('2', true));
    intervalSup.unsubscribe();
    process.stdout.write('\n');
    console.log(`got user: id: ${user.id}, first name: ${user.firstName}, last name: ${user.lastName}`);

    intervalSup = interval(500).subscribe(() => process.stdout.write('.'));
    user = await firstValueFrom(fetchUser('2'));
    intervalSup.unsubscribe();
    process.stdout.write('\n');
    console.log(`got user: id: ${user.id}, first name: ${user.firstName}, last name: ${user.lastName}`);

}

main();