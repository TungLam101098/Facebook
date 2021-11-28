import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { Table } from 'antd';
import { useCollection } from 'react-firebase-hooks/firestore';

function Admin() {

    const [countUser, setCountUser] = useState(0);
    const [dataUser, setDataUser] = useState([]);
    const [count, setCount] = useState(0);

    const [realtimeUser] = useCollection(
        db
          .collection("users")
      );

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Birthday',
          dataIndex: 'birthday',
          key: 'birthday',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Active',
          key: 'active',
          dataIndex: 'active',
          render: ( active, data) => {
              return (
                <select onChange={(e) => changeValue(e, data.key)}>
                    {
                        active ? (<option value={true}>isActive: true</option>) : (<option value={false}>isActive: false</option>)
                    }
                    <option value={true}>true</option>
                    <option value={false}>false</option>
                </select>
              )
          },
        },
      ];

    const changeValue = async (e, id) => {
        var check = false;
        if (e.target.value === "true") {
            check = true;
        } else {
            check = false;
        }
        const listNoticationsRef = db
        .collection("users")
        .doc(id);
        await listNoticationsRef.update({
            isActive: check,
        });
        
    }

    useEffect(() => {
        let count = 0;
        if (!realtimeUser) {
          return;
        }
        realtimeUser.docs.map((doc) => {
          if (!doc.data().isActive) {
            count++;
          }
        });
        setCount(count);
      }, [realtimeUser]);

    useEffect(() => {
        const getDataFromFirebase = async () => {
          const userDataRef = db.collection("users");
          const snapshot = await userDataRef.get();
          if (snapshot.empty) {
            console.log("No matching documents.");
            return;
          }
          
          snapshot.forEach((doc) => {
            setDataUser((prevState) => [
              ...prevState,
              {
                key: doc.id,
                name: doc.data().surname.concat(" ", doc.data().name),
                birthday: doc.data().birthday,
                email: doc.data().email,
                active:  doc.data().isActive,
              },
            ]);
          });
            setCountUser(snapshot.docs.length);
        };
        
        getDataFromFirebase();
      }, []);
    return (
        <>
            <div className="flex p-5">
                <div style={{width: '50%'}} >
                    <span className="text-blue-500 uppercase text-lg">Tổng số lượng khách hàng</span>
                    <p>{countUser}</p>
                </div>
                <div style={{width: '50%'}} className="mr-2">
                    <span className="text-blue-500 uppercase text-lg">Tổng số lượng khách bị khoá</span>
                    <p>{count}</p>
                </div>
            </div>
            <div className="p-5">
                {
                    dataUser && (
                        <Table columns={columns} dataSource={dataUser} />
                    )
                }
            </div>
        </>
    )
}

export default Admin
