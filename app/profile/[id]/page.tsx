import { StudentProfileData } from '@/app/api/profile/_model/apitype';
import { EditIntro } from '@/components/profile/editintro-button';
import { EditProfileButton } from '@/components/profile/editprofile-button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, PenLineIcon, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`${process.env.MYURL}/api/profile/${id}`);

  if (!res.ok) {
    throw new Error('cannot find the user');
  }

  const profile = await res.json() as StudentProfileData;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>About me</CardTitle>
        </CardHeader>
        <div className="p-4">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <img
                src={profile.student.avatar}
                className="h-60 w-60 rounded-full border-4 object-cover"
              />
              <span className="mt-2 gap-2 text-center text-2xl font-bold">
                {profile.student.name}
              </span>
              <EditProfileButton profileID={id} />
            </div>
            <div className={`
              flex flex-grow flex-col rounded-lg border-2 p-4
              dark:border-gray-500 dark:bg-gray-800
            `}
            >
              <div className="flex justify-between">
                <span className="flex text-lg font-semibold">
                  <PenLineIcon />
                  Introduce
                </span>
                <EditIntro profileID={id} />
              </div>
              <p className="mt-2 text-gray-500">{profile.student.intro !== '' ? profile.student.intro : '這個人什麼都沒寫'}</p>
            </div>
          </div>

          <div className="mt-3">
            <h2 className="mb-2 text-xl font-bold">作業繳交狀況</h2>
            <div className={`
              overflow-x-auto rounded-lg p-4
              dark:bg-gray-800
            `}
            >
              <table className={`
                min-w-full text-center text-sm
                dark:text-white
              `}
              >
                <thead>
                  <tr>
                    {profile.student.hw.map((_, index) => (
                      <th
                        key={index}
                        className={`
                          px-3 py-2
                          hover:underline
                        `}
                      >
                        <Link href={index === 0 ? '/hw/hw-test' : `/hw/hw${index}`}>
                          {
                            index === 0 ? '測試作業' : `作業${index}`
                          }
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {profile.student.hw.map((status, index) => (
                      <td key={index} className="px-3 py-2">
                        <Link href={index === 0 ? '/hw/hw-test' : `/hw/hw${index}`}>
                          {status === '1'
                            ? (
                              <CheckCircle className={`
                                  mx-auto h-5 w-5 text-green-400
                                `}
                              />
                            )
                            : <XCircle className="mx-auto h-5 w-5 text-red-400" />}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
