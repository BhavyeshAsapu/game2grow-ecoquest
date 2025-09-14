-- Create rewards table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL CHECK (cost >= 0),
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Rewards policies
CREATE POLICY "Rewards are viewable by everyone"
ON public.rewards
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_rewards_updated_at
BEFORE UPDATE ON public.rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create reward_purchases table
CREATE TABLE public.reward_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reward_purchases ENABLE ROW LEVEL SECURITY;

-- Purchases policies
CREATE POLICY "Users can view their own reward purchases"
ON public.reward_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Secure function to redeem reward
CREATE OR REPLACE FUNCTION public.redeem_reward(p_reward_id UUID)
RETURNS TABLE (purchase_id UUID, new_points INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_cost INTEGER;
  v_current_points INTEGER;
  v_purchase_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT cost INTO v_cost FROM public.rewards WHERE id = p_reward_id AND active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reward not found';
  END IF;

  -- Lock user's row to prevent race conditions
  SELECT points INTO v_current_points FROM public.profiles WHERE user_id = v_user_id FOR UPDATE;
  IF v_current_points IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF v_current_points < v_cost THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;

  UPDATE public.profiles
  SET points = v_current_points - v_cost
  WHERE user_id = v_user_id
  RETURNING points INTO v_current_points;

  INSERT INTO public.reward_purchases (user_id, reward_id)
  VALUES (v_user_id, p_reward_id)
  RETURNING id INTO v_purchase_id;

  RETURN QUERY SELECT v_purchase_id, v_current_points;
END;
$$;

-- Secure function permissions
REVOKE ALL ON FUNCTION public.redeem_reward(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_reward(UUID) TO anon, authenticated;

-- Seed rewards
INSERT INTO public.rewards (title, description, cost, image_url)
VALUES 
  ('Eco Workbook', 'Printable activities on recycling and energy saving.', 100, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
  ('Science E-Book', 'Intro to environmental science for teens.', 250, 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e'),
  ('Plantable Seed Paper', 'Seed paper for a small home planting project.', 400, 'https://images.unsplash.com/photo-1524593137-9f3fd3fbffc8');