import { FormControl, Input, FormLabel, Flex, Grid, Text, Button } from '@chakra-ui/react';
import times from 'lodash.times';
import React, { useState } from 'react';
import { FC } from 'react';
import { useList } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer } from '../../Components/ResponsiveContainer';
import { useQuery } from 'react-query';
import walletService from '../../../services/wallet';
/**
 * Confirm the mnemonic
 */
export const RecoveryWallet: FC = () => {
  const [mnemonicWords, mnemonicWordAction] = useList(times(12, () => ''));
  const [password, setPassword] = useState('');
  const { refetch: save, isLoading } = useQuery(
    [mnemonicWords, password] as const,
    ({ queryKey }) => {
      walletService.createNewWallet(queryKey[0], queryKey[1]);
    },
    {
      enabled: false,
    },
  );
  const navigate = useNavigate();

  const inputs = times(12, (index) => (
    <FormControl key={index}>
      <FormLabel>Word {index + 1}</FormLabel>
      <Input
        value={mnemonicWords[index]}
        onChange={(e) => {
          mnemonicWordAction.updateAt(index, e.target.value);
        }}
      />
    </FormControl>
  ));

  const onRecoveryWallet = async () => {
    await save();
    navigate('/success', { replace: true });
  };

  return (
    <ResponsiveContainer centerContent h="100%">
      <Flex direction="column" alignItems="center" h="100%" justifyContent="center">
        <Text fontSize="2xl" mb="40px">
          Please input your recovery mnemonic
        </Text>
        <Grid gridGap="16px" gridTemplate="repeat(5, auto) / repeat(3, 1fr)">
          {inputs}
        </Grid>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormControl>
        <Button colorScheme="green" w="100%" marginTop="20px" onClick={onRecoveryWallet} isLoading={isLoading}>
          Recovery
        </Button>
      </Flex>
    </ResponsiveContainer>
  );
};